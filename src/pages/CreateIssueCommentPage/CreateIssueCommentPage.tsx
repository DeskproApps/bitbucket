import { useState, useCallback } from "react";
import get from "lodash/get";
import { useNavigate, useSearchParams, createSearchParams } from "react-router-dom";
import { useDeskproElements, useDeskproAppClient } from "@deskpro/app-sdk";
import { useSetTitle, useAsyncError } from "../../hooks";
import { createIssueCommentService } from "../../services/bitbucket";
import { CreateIssueComment } from "../../components";
import { getValues } from "../../components/IssueCommentForm";
import type { FC } from "react";
import type { Maybe } from "../../types";
import type { FormValidationSchema } from "../../components/IssueCommentForm";

const CreateIssueCommentPage: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { client } = useDeskproAppClient();
  const { asyncErrorHandler } = useAsyncError();
  const [error, setError] = useState<Maybe<string | string[]>>(null);

  const issueId = searchParams.get("issueId");
  const repo = searchParams.get("repo");

  const onCancel = useCallback(() => {
    if (!issueId || !repo) {
      return;
    }

    navigate({
      pathname: `/issue/view`,
      search: `?${createSearchParams({ issueId, repo })}`,
    });
  }, [navigate, issueId, repo]);

  const onSubmit = useCallback((values: FormValidationSchema) => {
    if (!client || !issueId || !repo) {
      return Promise.resolve();
    }

    return createIssueCommentService(client, repo, Number(issueId), getValues(values))
      .then(() => navigate({
        pathname: `/issue/view`,
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
  }, [client, issueId, repo, navigate, asyncErrorHandler]);

  useSetTitle("Comment");

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();

    registerElement("refresh", { type: "refresh_button" });
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
    });
  });

  return (
    <CreateIssueComment
      error={error}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
};

export { CreateIssueCommentPage };
