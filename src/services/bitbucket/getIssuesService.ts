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
    if (e instanceof BitbucketError && isBitbucketAPIError(e.data)) {
      const { error } = e.data;
      const message = error?.message ?? "Error retrieving issues";

      // Early return for the Jira issues bug.
      if (message === "Resource not found" && repo?.trim() !== "") {
        return {
          success: false,
          errorCode: "jira-issues-bug",
          message: "Unable to retrieve issues as this repository uses Jira issues.",
          error: e,
        };
      }

      // All other Bitbucket errors.
      return { success: false, message, error: e };
    }

    // For errors that aren't Bitbucket errors.
    return { success: false, message: e instanceof Error ? e.message : "Error retrieving issues", error: e };
  }
}
