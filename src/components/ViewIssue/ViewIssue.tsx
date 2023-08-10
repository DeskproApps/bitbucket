import { HorizontalDivider } from "@deskpro/app-sdk";
import { Details, Comments } from "./blocks";
import type { FC } from "react";
import type { Issue, Comment, Attachment, Link } from "../../services/bitbucket/types";

type Props = {
  issue: Issue,
  comments: Comment[],
  attachments: Attachment[],
  onDownloadAttachment: (url: Link["href"], filename: Attachment["name"]) => Promise<void>,
  onNavigateToAddComment: () => void,
};

const ViewIssue: FC<Props> = ({
  issue,
  comments,
  attachments,
  onDownloadAttachment,
  onNavigateToAddComment,
}) => {
  return (
    <>
      <Details
        issue={issue}
        attachments={attachments}
        onDownloadAttachment={onDownloadAttachment}
      />
      <HorizontalDivider/>
      <Comments
        comments={comments}
        onNavigateToAddComment={onNavigateToAddComment}
      />
    </>
  );
};

export { ViewIssue };
