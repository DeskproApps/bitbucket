import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Issue, Repository, Comment, Content } from "./types";

const createIssueCommentService = (
    client: IDeskproClient,
    repo: Repository["full_name"],
    issueId: Issue["id"],
    data: { content: Pick<Content, "markup"|"raw"> },
) => {
  return baseRequest<Comment>(client, {
    url: `/repositories/${repo}/issues/${issueId}/comments`,
    method: "POST",
    data,
  });
};

export { createIssueCommentService };
