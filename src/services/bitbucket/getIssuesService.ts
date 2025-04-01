import { baseRequest } from "./baseRequest";
import { BitbucketError, isBitbucketAPIError } from "./BitbucketError";
import { Result } from "../../types";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Issue, Pagination, Repository } from "./types";

export async function getIssuesService(
  client: IDeskproClient,
  repo: Repository["full_name"]
): Promise<Result<Pagination<Issue>>> {
  try {
    const issues = await baseRequest<Pagination<Issue>>(client, {
      url: `/repositories/${repo}/issues`,
      queryParams: [
        "pagelen=100",
        `fields=${encodeURIComponent(
          "+values.repository.project,+values.repository.workspace"
        )}`,
      ].join("&"),
    });

    return {
      success: true,
      data: issues,
    };
  } catch (e) {
    let message: string | null = null;

    if (e instanceof BitbucketError && isBitbucketAPIError(e.data)) {
      // Return a custom error while considering false positives
      if (
        e.data.error?.message === "Resource not found" &&
        repo &&
        repo.trim() !== ""
      ) {
        return {
          success: false,
          errorCode: "jira-issues-bug",
          message:
            "Unable to retrieve issues as this repository uses Jira issues.",
          error: e,
        };
      } else {
        message = e.data.error?.message;
      }
    }

    return {
      success: false,
      message: message ?? "Error retrieving issues",
      error: e,
    };
  }
}
