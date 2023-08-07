import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Issue, Pagination, Repository } from "./types";

const getIssuesService = (
  client: IDeskproClient,
  repo: Repository["full_name"],
) => {
  return baseRequest<Pagination<Issue>>(client, {
    url: `/repositories/${repo}/issues`,
    queryParams: [
      "pagelen=100",
      `fields=${encodeURIComponent("+values.repository.project,+values.repository.workspace")}`,
    ].join("&"),
  });
};

export { getIssuesService };
