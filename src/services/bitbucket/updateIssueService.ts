import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Issue, Repository } from "./types";

const updateIssueService = (
  client: IDeskproClient,
  repo: Repository["full_name"],
  issueId: Issue["id"],
  data: object,
) => {
  return baseRequest<Issue>(client, {
    url: `/repositories/${repo}/issues/${issueId}`,
    method: "PUT",
    data,
  });
};

export { updateIssueService };
