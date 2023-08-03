import { useCallback } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { useDeskproElements, LoadingSpinner } from "@deskpro/app-sdk";
import { useSetTitle, useSetBadgeCount, useLinkedIssues } from "../../hooks";
import { Home } from "../../components";
import type { FC } from "react";
import type { Issue, Repository } from "../../services/bitbucket/types";

const HomePage: FC = () => {
  const navigate = useNavigate();
  const { issues, isLoading } = useLinkedIssues();

  const onNavigateToIssue = useCallback((
    issueId: Issue["id"],
    fullName: Repository["full_name"],
  ) => {
    navigate({
      pathname: "/issue/view",
      search: `?${createSearchParams({
        issueId: `${issueId}`,
        fullName,
      })}`,
    });
  }, [navigate]);

  useSetTitle("Bitbucket");
  useSetBadgeCount(issues);

  useDeskproElements(({ registerElement, clearElements }) => {
    clearElements();
    registerElement("refresh", { type: "refresh_button" });
    registerElement("plus", {
      type: "plus_button",
      payload: { type: "changePage", path: "/link" },
    });
    registerElement("menu", {
      type: "menu",
      items: [{
        title: "Log Out",
        payload: {
          type: "logout",
        },
      }],
    });
  });

  if (isLoading) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
    <Home issues={issues} onNavigateToIssue={onNavigateToIssue} />
  );
};

export { HomePage };
