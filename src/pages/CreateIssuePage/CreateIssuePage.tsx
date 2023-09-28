import { useState, useMemo, useCallback } from "react";
import get from "lodash/get";
import { useNavigate } from "react-router-dom";
import {
  useDeskproElements,
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import {
  useSetTitle,
  useReplyBox,
  useAsyncError,
  useLinkedAutoComment,
} from "../../hooks";
import { createIssueService, uploadAttachToIssueService } from "../../services/bitbucket";
import { setEntityService } from "../../services/deskpro";
import { generateEntityId } from "../../utils";
import {
  getIssueRepo,
  getIssueValues,
  getIssueAttachments,
} from "../../components/IssueForm";
import { CreateIssue } from "../../components";
import type { FC } from "react";
import type { Maybe, TicketContext } from "../../types";
import type { FormValidationSchema } from "../../components/IssueForm";

const CreateIssuePage: FC = () => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext() as { context: TicketContext };
  const { asyncErrorHandler } = useAsyncError();
  const { addLinkComment } = useLinkedAutoComment();
  const { setSelectionState } = useReplyBox();
  const [error, setError] = useState<Maybe<string|string[]>>(null);
  const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);

  const onNavigateToLink = useCallback(() => navigate("/link"), [navigate]);

  const onCancel = useCallback(() => navigate("/home"), [navigate]);

  const onSubmit = useCallback((values: FormValidationSchema) => {
    if (!client || !ticketId) {
      return Promise.resolve();
    }

    const repo = getIssueRepo(values);
    const data = getIssueValues(values);
    const attachments = getIssueAttachments(values);

    setError(null);

    return createIssueService(client, repo, data)
      .then((issue) => !attachments
        ? Promise.resolve(issue)
        : uploadAttachToIssueService(client, repo, issue.id, attachments)
          .then(() => issue)
          .catch(() => issue)
      )
      .then((issue) => Promise.all([
        setEntityService(client, ticketId, generateEntityId(issue) as string),
        addLinkComment(issue),
        setSelectionState(issue, true, "email"),
        setSelectionState(issue, true, "note"),
      ]))
      .then(() => navigate("/home"))
      .catch((err) => {
        const error = get(err, ["data", "error", "message"]);

        if (error) {
          setError(error);
        } else {
          asyncErrorHandler(err);
        }
      });
  }, [client, ticketId, navigate, asyncErrorHandler, addLinkComment, setSelectionState]);

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
