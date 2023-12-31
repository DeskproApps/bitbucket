import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Issue, Repository } from "./types";

const createIssueService = (
  client: IDeskproClient,
  repo: Repository["full_name"],
  data: object
) => {
  return baseRequest<Issue>(client, {
    url: `/repositories/${repo}/issues`,
    method: "POST",
    data,
  });
};

export { createIssueService };
