import { BitbucketError, createIssueService, uploadAttachToIssueService } from "../../services/bitbucket";
import { CreateIssue } from "../../components";
import { generateEntityId } from "../../utils";
import { getIssueAttachments, getIssueRepo, getIssueValues } from "../../components/IssueForm";
import { isBitbucketAPIError } from "../../services/bitbucket/BitbucketError";
import { setEntityService } from "../../services/deskpro";
import { useDeskproAppClient, useDeskproElements, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { useLinkedAutoComment, useReplyBox, useSetTitle } from "../../hooks";
import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import type { FC } from "react";
import type { FormValidationSchema } from "../../components/IssueForm";
import type { Maybe, Settings, TicketData } from "../../types";

const CreateIssuePage: FC = () => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext<TicketData, Settings>();
  const { addLinkComment } = useLinkedAutoComment();
  const { setSelectionState } = useReplyBox();
  const [error, setError] = useState<Maybe<string | string[]>>(null);

  const ticketId = context?.data?.ticket.id;

  const onNavigateToLink = useCallback(() => navigate("/link"), [navigate]);

  const onCancel = useCallback(() => navigate("/home"), [navigate]);

  const onSubmit = useCallback(
    (values: FormValidationSchema) => {
      if (!client || !ticketId) {
        return Promise.resolve();
      }

      const repo = getIssueRepo(values);
      const data = getIssueValues(values);
      const attachments = getIssueAttachments(values);

      setError(null);

      return createIssueService(client, repo, data)
        .then((issue) =>
          !attachments
            ? Promise.resolve(issue)
            : uploadAttachToIssueService(client, repo, issue.id, attachments)
              .then(() => issue)
              .catch(() => issue)
        )
        .then((issue) =>
          Promise.all([
            setEntityService(
              client,
              ticketId,
              generateEntityId(issue) as string
            ),
            addLinkComment(issue),
            setSelectionState(issue, true, "email"),
            setSelectionState(issue, true, "note"),
          ])
        )
        .then(() => navigate("/home"))
        .catch((err) => {
          const defaultErrorMessage =
            "An unexpected error occurred while creating the issue.";

          if (err instanceof BitbucketError && isBitbucketAPIError(err.data)) {
            const message = err.data.error?.message;
            if (message === "Resource not found") {
              setError(
                "Unable to create this issue as the selected repository uses Jira issues."
              );
            } else {
              setError(err.data.error?.message ?? defaultErrorMessage);
            }
          } else {
            setError(defaultErrorMessage);
          }
        });
    },
    [client, ticketId, navigate, addLinkComment, setSelectionState]
  );

  useSetTitle("Link Issues");

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement("refresh", { type: "refresh_button" });
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
    });
  });

  return (
    <CreateIssue
      error={error}
      onSubmit={onSubmit}
      onCancel={onCancel}
      onNavigateToLink={onNavigateToLink}
    />
  );
};

export { CreateIssuePage };
