import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Issue, Repository, Pagination, Attachment } from "./types";

const getIssueAttachmentsService = (
  client: IDeskproClient,
  repo: Repository["full_name"],
  issueId: Issue["id"],
) => {
  return baseRequest<Pagination<Attachment>>(client, {
    url: `/repositories/${repo}/issues/${issueId}/attachments`,
    queryParams: {
      pagelen: "100",
    },
  });
};

export { getIssueAttachmentsService };
