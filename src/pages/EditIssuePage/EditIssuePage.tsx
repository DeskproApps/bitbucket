import { useState, useCallback } from "react";
import {
  useNavigate,
  useSearchParams,
  createSearchParams,
} from "react-router-dom";
import get from "lodash/get";
import {
  LoadingSpinner,
  useDeskproElements,
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import {
  updateIssueService,
    uploadAttachToIssueService,
} from "../../services/bitbucket";
import { useSetTitle, useAsyncError } from "../../hooks";
import { useIssue } from "./hook";
import { getIssueValues, getIssueAttachments } from "../../components/IssueForm";
import { EditIssue } from "../../components";
import type { FC } from "react";
import type { Maybe, TicketContext } from "../../types";
import type { FormValidationSchema } from "../../components/IssueForm";

const EditIssuePage: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext() as { context: TicketContext };
  const { asyncErrorHandler } = useAsyncError();
  const [error, setError] = useState<Maybe<string|string[]>>(null);
  const ticketId = get(context, ["data", "ticket", "id"]);

  const issueId = searchParams.get("issueId");
  const repo = searchParams.get("repo");

  const { isLoading, issue } = useIssue(Number(issueId), repo);

  const onCancel = useCallback(() => {
    if (!issueId || !repo) {
      return;
    }

    navigate({
      pathname: "/issue/view",
      search: `?${createSearchParams({ issueId, repo })}`,
    });
  }, [navigate, issueId, repo]);

  const onSubmit = useCallback((values: FormValidationSchema) => {
    if (!client || !ticketId || !issueId || !repo) {
      return Promise.resolve();
    }

    const data = getIssueValues(values);
    const attachments = getIssueAttachments(values);

    setError(null);

    return updateIssueService(client, repo, Number(issueId), data)
        .then((issue) => !attachments
            ? Promise.resolve(issue)
            : uploadAttachToIssueService(client, repo, Number(issueId), attachments)
                .then(() => issue)
                .catch(() => issue)
        )
        .then(() => navigate({
          pathname: "/issue/view",
          search: `?${createSearchParams({ issueId, repo })}`,
        }))
        .catch((err) => {
          const error = get(err, ["data", "error", "message"]);

          if (error) {
            setError(error);
          } else {
            asyncErrorHandler(err);
          }
        })
  }, [client, ticketId, issueId, repo, navigate, asyncErrorHandler]);

  useSetTitle("Edit Issue");

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement("refresh", { type: "refresh_button" });
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
    });
  });

  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <EditIssue
      issue={issue}
      error={error}
      onCancel={onCancel}
      onSubmit={onSubmit}
    />
  );
};

export { EditIssuePage };
