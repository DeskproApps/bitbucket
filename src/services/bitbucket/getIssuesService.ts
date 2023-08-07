import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Issue, Pagination } from "./types";

const getIssuesService = (
  client: IDeskproClient,
  fullName: string,
) => {
  return baseRequest<Pagination<Issue>>(client, {
    url: `/repositories/${fullName}/issues`,
    queryParams: [
      "pagelen=100",
      `fields=${encodeURIComponent("+values.repository.project,+values.repository.workspace")}`,
    ].join("&"),
  });
};

export { getIssuesService };
