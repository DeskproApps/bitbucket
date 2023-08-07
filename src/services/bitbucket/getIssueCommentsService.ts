import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Issue, Repository, Pagination, Comment } from "./types";

const getIssueCommentsService = (
  client: IDeskproClient,
  fullName: Repository["full_name"],
  issueId: Issue["id"],
) => {
  return baseRequest<Pagination<Comment>>(client, {
    url: `/repositories/${fullName}/issues/${issueId}/comments`,
    queryParams: [
      "pagelen=100",
      "sort=-created_on",
      `fields=${encodeURIComponent("-values.issue")}`,
    ].join("&"),
  });
};

export { getIssueCommentsService };
