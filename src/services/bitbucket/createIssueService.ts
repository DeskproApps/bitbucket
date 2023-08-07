import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Issue, Repository } from "./types";

const createIssueService = (
  client: IDeskproClient,
  fullName: Repository["full_name"],
  data: object
) => {
  return baseRequest<Issue>(client, {
    url: `/repositories/${fullName}/issues`,
    method: "POST",
    data,
  });
};

export { createIssueService };
