import size from "lodash/size";
import type { Maybe } from "../types";
import type { Comment } from "../services/bitbucket/types";

const filterIssueComments = (comments?: Maybe<Comment[]>): Comment[] => {
  if (!Array.isArray(comments) || !size(comments)) {
    return [];
  }

  return comments.filter((comment) => Boolean(comment.content.raw));
};

export { filterIssueComments };
