import { useMemo, useCallback, useContext, createContext } from "react";
import get from "lodash/get";
import size from "lodash/size";
import noop from "lodash/noop";
import isEmpty from "lodash/isEmpty";
import { match } from "ts-pattern";
import { useDebouncedCallback } from "use-debounce";
import {
  useDeskproAppClient,
  useDeskproAppEvents,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useLinkedIssues } from "./useLinkedIssues";
import { getEntityListService } from "../services/deskpro";
import { createIssueCommentService } from "../services/bitbucket";
import {generateEntityId, parseEntityId} from "../utils";
import { queryClient } from "../query";
import { APP_PREFIX } from "../constants";
import type { FC, PropsWithChildren } from "react";
import type { IDeskproClient, GetStateResponse, TargetAction } from "@deskpro/app-sdk";
import type { Issue, Repository } from "../services/bitbucket/types";
import type { TicketContext, TicketData } from "../types";

export type ReplyBoxType = "note" | "email";

export type SetSelectionState = (issue: Issue, selected: boolean, type: ReplyBoxType) => void|Promise<{ isSuccess: boolean }|void>;

export type GetSelectionState = (issue: Issue, type: ReplyBoxType) => void|Promise<Array<GetStateResponse<string>>>;

export type DeleteSelectionState = (issue: Issue, type: ReplyBoxType) => void|Promise<boolean|void>;

type ReturnUseReplyBox = {
  setSelectionState: SetSelectionState,
  getSelectionState: GetSelectionState,
  deleteSelectionState: DeleteSelectionState,
};

const noteKey = (ticketId: string, linkedIssueId: string|"*") => {
  return `tickets/${ticketId}/${APP_PREFIX}/notes/selection/${linkedIssueId}`;
};

const emailKey = (ticketId: string, linkedIssueId: string|"*") => {
  return `tickets/${ticketId}/${APP_PREFIX}/emails/selection/${linkedIssueId}`;
};

const registerReplyBoxNotesAdditionsTargetAction = (
  client: IDeskproClient,
  ticketId: TicketData["ticket"]["id"],
  linkedIssueIds: Array<string>,
  issuesMap: Record<string, Issue>,
): void|Promise<void> => {
  if (!ticketId) {
    return;
  }

  if (Array.isArray(linkedIssueIds) && !size(linkedIssueIds)) {
    return client.deregisterTargetAction(`${APP_PREFIX}ReplyBoxNoteAdditions`);
  }

  return Promise
    .all(linkedIssueIds.map(
      (linkedIssueId: string) => client.getState<{ selected: boolean }>(noteKey(ticketId, linkedIssueId)))
    )
    .then((flags) => {
      return client.registerTargetAction(`${APP_PREFIX}ReplyBoxNoteAdditions`, "reply_box_note_item_selection", {
        title: "Add to Bitbucket",
        payload: linkedIssueIds.map((linkedIssueId, idx) => ({
          id: linkedIssueId,
          title: `#${get(issuesMap, [linkedIssueId, "id"])}`,
          selected: flags[idx][0]?.data?.selected ?? false,
        })),
      });
    })
    ;
};

const registerReplyBoxEmailsAdditionsTargetAction = (
  client: IDeskproClient,
  ticketId: TicketData["ticket"]["id"],
  linkedIssueIds: Array<string>,
  issuesMap: Record<string, Issue>,
): void|Promise<void> => {
  if (!ticketId) {
    return;
  }

  if (Array.isArray(linkedIssueIds) && !size(linkedIssueIds)) {
    return client.deregisterTargetAction(`${APP_PREFIX}ReplyBoxEmailAdditions`);
  }

  return Promise
    .all(linkedIssueIds.map(
      (linkedIssueId: string) => client.getState<{ selected: boolean }>(emailKey(ticketId, linkedIssueId)))
    )
    .then((flags) => {
      return client.registerTargetAction(`${APP_PREFIX}ReplyBoxEmailAdditions`, "reply_box_email_item_selection", {
        title: `Add to Bitbucket`,
        payload: linkedIssueIds.map((linkedIssueId, idx) => ({
          id: linkedIssueId,
          title: `#${get(issuesMap, [linkedIssueId, "id"])}`,
          selected: flags[idx][0]?.data?.selected ?? false,
        })),
      });
    });
};

const ReplyBoxContext = createContext<ReturnUseReplyBox>({
  setSelectionState: () => {},
  getSelectionState: () => {},
  deleteSelectionState: () => {},
});

const useReplyBox = () => useContext<ReturnUseReplyBox>(ReplyBoxContext);

const ReplyBoxProvider: FC<PropsWithChildren> = ({ children }) => {
  const { context } = useDeskproLatestAppContext() as { context: TicketContext };
  const { client } = useDeskproAppClient();
  const { issues } = useLinkedIssues();
  const issuesMap = useMemo(() => (Array.isArray(issues) ? issues : []).reduce<Record<string, Issue>>((acc, issue) => {
    if (!isEmpty(issue)) {
      acc[generateEntityId(issue) as string] = issue;
    }
    return acc;
  }, {}), [issues]);

  const ticketId = get(context, ["data", "ticket", "id"]);
  const isCommentOnNote = get(context, ["settings", "default_comment_on_ticket_note"]);
  const isCommentOnEmail = get(context, ["settings", "default_comment_on_ticket_reply"]);

  const setSelectionState: SetSelectionState = useCallback((issue, selected, type) => {
    const linkedIssueId = generateEntityId(issue);

    if (!ticketId || !client || !linkedIssueId) {
      return
    }

    if (type === "note" && isCommentOnNote) {
      return client.setState(noteKey(ticketId, linkedIssueId), { id: linkedIssueId, selected })
        .then(() => getEntityListService(client, ticketId))
        .then((linkedIssueIds) =>
          registerReplyBoxNotesAdditionsTargetAction(client, ticketId, linkedIssueIds, issuesMap)
        )
        .catch(noop)
    }

    if (type === "email" && isCommentOnEmail) {
      return client?.setState(emailKey(ticketId, linkedIssueId), { id: linkedIssueId, selected })
        .then(() => getEntityListService(client, ticketId))
        .then((linkedIssueIds) =>
          registerReplyBoxEmailsAdditionsTargetAction(client, ticketId, linkedIssueIds, issuesMap)
        )
        .catch(() => {})
    }
  }, [client, ticketId, isCommentOnNote, isCommentOnEmail, issuesMap]);

  const getSelectionState: GetSelectionState = useCallback((issue, type) => {
    const linkedIssueId = generateEntityId(issue);

    if (!ticketId || !linkedIssueId) {
      return
    }

    const key = (type === "email") ? emailKey : noteKey;
    return client?.getState<string>(key(ticketId, linkedIssueId))
  }, [client, ticketId]);

  const deleteSelectionState: DeleteSelectionState = useCallback((issue, type) => {
    const linkedIssueId = generateEntityId(issue);

    if (!ticketId || !client || !linkedIssueId) {
      return;
    }

    const key = (type === "email") ? emailKey : noteKey;

    return client.deleteState(key(ticketId, linkedIssueId))
      .then(() => getEntityListService(client, ticketId))
      .then((linkedIssueIds) => {
        const register = (type === "email") ? registerReplyBoxEmailsAdditionsTargetAction : registerReplyBoxNotesAdditionsTargetAction;
        return register(client, ticketId, linkedIssueIds, issuesMap);
      })
  }, [client, ticketId, issuesMap]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  useInitialisedDeskproAppClient((client) => {
    if (isCommentOnNote) {
      registerReplyBoxNotesAdditionsTargetAction(
        client,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ticketId,
        issues.map(generateEntityId).filter(Boolean) as string[],
        issuesMap,
      );
      client.registerTargetAction(`${APP_PREFIX}OnReplyBoxNote`, "on_reply_box_note");
    }

    if (isCommentOnEmail) {
      registerReplyBoxEmailsAdditionsTargetAction(
        client,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ticketId,
        issues.map(generateEntityId).filter(Boolean) as string[],
        issuesMap,
      );
      client.registerTargetAction(`${APP_PREFIX}OnReplyBoxEmail`, "on_reply_box_email");
    }
  }, [issues, ticketId, isCommentOnNote, isCommentOnEmail, issuesMap]);

  const debounceTargetAction = useDebouncedCallback<(a: TargetAction) => void>((action: TargetAction) => match<string>(action.name)
      .with(`${APP_PREFIX}OnReplyBoxEmail`, () => {
        const subjectTicketId = action.subject;
        const email = action.payload.email;

        if (!ticketId || !email || !client) {
          return;
        }

        if (subjectTicketId !== ticketId) {
          return;
        }

        client.setBlocking(true);
        client.getState<{ id: string; selected: boolean }>(emailKey(ticketId, "*"))
          .then((selections) => {
            const issues = selections
              .filter(({ data }) => data?.selected)
              .map(({ data }) => parseEntityId(data?.id))
              .filter(Boolean) as Array<{ repo: Repository["full_name"], issueId: Issue["id"] }>;

            return Promise
              .all(issues.map(({ issueId, repo }) => createIssueCommentService(
                client,
                repo,
                issueId,
                { content: { markup: "markdown", raw: email }},
              )))
              .then(() => queryClient.invalidateQueries());
          })
          .finally(() => client.setBlocking(false));
      })
      .with(`${APP_PREFIX}OnReplyBoxNote`, () => {
        const subjectTicketId = action.subject;
        const note = action.payload.note;

        if (!ticketId || !note || !client) {
          return;
        }

        if (subjectTicketId !== ticketId) {
          return;
        }

        client.setBlocking(true);
        client.getState<{ id: string; selected: boolean }>(noteKey(ticketId, "*"))
          .then((selections) => {
            const issues = selections
              .filter(({ data }) => data?.selected)
              .map(({ data }) => parseEntityId(data?.id))
              .filter(Boolean) as Array<{ repo: Repository["full_name"], issueId: Issue["id"] }>;

            return Promise
              .all(issues.map(({ issueId, repo }) => createIssueCommentService(
                client,
                repo,
                issueId,
                { content: { markup: "markdown", raw: note}},
              )))
              .then(() => queryClient.invalidateQueries());
          })
          .finally(() => client.setBlocking(false));
      })
      .with(`${APP_PREFIX}ReplyBoxEmailAdditions`, () => {
        (action.payload ?? []).forEach((selection: { id: string, selected: boolean }) => {
          const { id: linkedIssueId, selected } = selection;
          const subjectTicketId = action.subject;

          if (ticketId) {
            client?.setState(emailKey(subjectTicketId, linkedIssueId), { id: linkedIssueId, selected })
              .then((result) => {
                if (result.isSuccess) {
                  registerReplyBoxEmailsAdditionsTargetAction(
                    client,
                    ticketId,
                    issues.map(generateEntityId).filter(Boolean) as string[],
                    issuesMap,
                  );
                }
              });
          }
        })
      })
      .with(`${APP_PREFIX}ReplyBoxNoteAdditions`, () => {
        (action.payload ?? []).forEach((selection: { id: string; selected: boolean; }) => {
          const { id: linkedIssueId, selected } = selection;
          const subjectTicketId = action.subject;

          if (ticketId) {
            client?.setState(noteKey(subjectTicketId, linkedIssueId), { id: linkedIssueId, selected })
              .then((result) => {
                if (result.isSuccess) {
                  registerReplyBoxNotesAdditionsTargetAction(
                    client,
                    subjectTicketId,
                    issues.map(generateEntityId).filter(Boolean) as string[],
                    issuesMap,
                  );
                }
              });
          }
        })
      })
      .run(),
    200
  );

  useDeskproAppEvents({
    onTargetAction: debounceTargetAction,
  }, [context?.data]);

  return (
    <ReplyBoxContext.Provider value={{
      setSelectionState,
      getSelectionState,
      deleteSelectionState,
    }}>
      {children}
    </ReplyBoxContext.Provider>
  );
};

export { useReplyBox, ReplyBoxProvider };
