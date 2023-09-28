import { useCallback } from "react";
import get from "lodash/get";
import toNumber from "lodash/toNumber";
import { useNavigate, createSearchParams, useSearchParams } from "react-router-dom";
import {
  LoadingSpinner,
  useDeskproElements,
  useDeskproAppClient,
} from "@deskpro/app-sdk";
import { useSetTitle, useAsyncError } from "../../hooks";
import { useIssue } from "./hook";
import { triggerDownloadFileToUser } from "../../utils";
import { downloadFileService } from "../../services/bitbucket";
import { ViewIssue } from "../../components";
import type { FC } from "react";
import type { Link } from "../../services/bitbucket/types";

const ViewIssuePage: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { client } = useDeskproAppClient();
  const { asyncErrorHandler } = useAsyncError();
  const issueId = searchParams.get("issueId");
  const repo = searchParams.get("repo");

  const { issue, comments, attachments, isLoading } = useIssue(toNumber(issueId), repo);

  const onNavigateToAddComment = useCallback(() => {
    if (!issueId || !repo) {
      return;
    }

    navigate({
      pathname: `/issue/comment/create`,
      search: `?${createSearchParams({ issueId, repo })}`,
    });
  }, [navigate, issueId, repo]);

  const onDownloadAttachment = useCallback((url: Link["href"], filename: string) => {
    if (!client) {
      return Promise.resolve();
    }

    return downloadFileService(client, url)
        .then((file) => triggerDownloadFileToUser(file, filename))
        .catch(asyncErrorHandler);
  }, [client, asyncErrorHandler]);

  useSetTitle(`#${issueId}`);

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement("refresh", { type: "refresh_button" });
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
    });
    registerElement("edit", {
      type: "edit_button",
      payload: { type: "changePage", path: {
          pathname: `/issue/edit`,
          search: `?${createSearchParams({
            issueId: `${get(issue, ["id"])}`,
            repo: get(issue, ["repository", "full_name"]),
          })}`,
      }}
    });
    registerElement("menu", {
      type: "menu",
      items: [{
        title: "Unlink issue",
        payload: { type: "unlink", issue },
      }],
    });
  }, [issue]);

  if (isLoading) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
    <ViewIssue
      issue={issue}
      comments={comments}
      attachments={attachments}
      onDownloadAttachment={onDownloadAttachment}
      onNavigateToAddComment={onNavigateToAddComment}
    />
  );
};

export { ViewIssuePage };
