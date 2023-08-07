import toNumber from "lodash/toNumber";
import { useSearchParams } from "react-router-dom";
import {
  LoadingSpinner,
  useDeskproElements,
} from "@deskpro/app-sdk";
import { useSetTitle } from "../../hooks";
import { useIssue } from "./hook";
import { ViewIssue } from "../../components";
import type { FC } from "react";

const ViewIssuePage: FC = () => {
  const [searchParams] = useSearchParams();
  const issueId = searchParams.get("issueId");
  const fullName = searchParams.get("fullName");

  const { issue, comments, isLoading } = useIssue(toNumber(issueId), fullName);

  useSetTitle(`#${issueId}`);

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement("refresh", { type: "refresh_button" });
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
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
    <ViewIssue issue={issue} comments={comments} />
  );
};

export { ViewIssuePage };
