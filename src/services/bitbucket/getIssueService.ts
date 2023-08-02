import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Issue, Repository } from "./types";

const getIssueService = (
  client: IDeskproClient,
  fullName: Repository["full_name"],
  issueId: Issue["id"],
) => {
  return baseRequest<Issue>(client, {
    url: `/repositories/${fullName}/issues/${issueId}`,
    queryParams: `fields=${encodeURIComponent("+repository.project,+repository.workspace")}`,
  });
};

export { getIssueService };
