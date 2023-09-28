import get from "lodash/get";
import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Issue, Repository, Pagination, Comment } from "./types";

type Options = {
  repo: Repository["full_name"],
  issueId: Issue["id"],
  params?:  {
    pagelen?: Pagination<Comment>["pagelen"],
    page?: Pagination<Comment>["page"],
  },
};

const getIssueCommentsService = (
  client: IDeskproClient,
  { repo, issueId, ...params }: Options,
) => {
  const pagelen = get(params, ["pagelen"], 100);
  const page = get(params, ["page"], 1);

  return baseRequest<Pagination<Comment>>(client, {
    url: `/repositories/${repo}/issues/${issueId}/comments`,
    queryParams: [
      `pagelen=${pagelen}`,
      `page=${page}`,
      "sort=-created_on",
      `fields=${encodeURIComponent("-values.issue")}`,
    ].join("&"),
  });
};

export { getIssueCommentsService };
