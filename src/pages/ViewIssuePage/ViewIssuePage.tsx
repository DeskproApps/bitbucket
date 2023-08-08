import { useCallback } from "react";
import get from "lodash/get";
import toNumber from "lodash/toNumber";
import { useNavigate, createSearchParams, useSearchParams } from "react-router-dom";
import {
  LoadingSpinner,
  useDeskproElements,
} from "@deskpro/app-sdk";
import { useSetTitle } from "../../hooks";
import { useIssue } from "./hook";
import { ViewIssue } from "../../components";
import type { FC } from "react";

const ViewIssuePage: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const issueId = searchParams.get("issueId");
  const repo = searchParams.get("repo");

  const { issue, comments, isLoading } = useIssue(toNumber(issueId), repo);

  const onNavigateToAddComment = useCallback(() => {
    if (!issueId || !repo) {
      return;
    }

    navigate({
      pathname: `/issue/comment/create`,
      search: `?${createSearchParams({ issueId, repo })}`,
    });
  }, [navigate, issueId, repo]);

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
      onNavigateToAddComment={onNavigateToAddComment}
    />
  );
};

export { ViewIssuePage };
