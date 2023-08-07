import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Issue, Repository } from "./types";

const uploadAttachToIssueService = (
  client: IDeskproClient,
  fullName: Repository["full_name"],
  issueId: Issue["id"],
  data: FormData,
) => {
  return baseRequest<void>(client, {
    url: `/repositories/${fullName}/issues/${issueId}/attachments`,
    method: "POST",
    data,
  });
};

export { uploadAttachToIssueService };
