import { HorizontalDivider } from "@deskpro/app-sdk";
import { Details, Comments } from "./blocks";
import type { FC } from "react";
import type { Issue, Comment } from "../../services/bitbucket/types";

type Props = {
  issue: Issue,
  comments: Comment[],
};

const ViewIssue: FC<Props> = ({ issue, comments }) => {
  return (
    <>
      <Details issue={issue}/>
      <HorizontalDivider/>
      <Comments comments={comments} />
    </>
  );
};

export { ViewIssue };
