import { getRepositoriesService, getIssuesService } from "../../services/bitbucket";
import { QueryKey } from "../../query";
import { useEffect, useState } from "react";
import { useQueryWithClient } from "@deskpro/app-sdk";
import type { Issue, Pagination, Repository } from "../../services/bitbucket/types";

type UseSearchIssues = (repo?: Repository["full_name"]) => {
  error?: string;
  isLoading: boolean;
  issues: Issue[];
  repositories: Repository[];
};

/**
 * Hook to retrieve Bitbucket repositories & issues.
 */
const useSearchIssues: UseSearchIssues = (repo) => {
  const [error, setError] = useState<string | undefined>(undefined);

  // Reset errors when the selected repo changes.
  useEffect(() => {
    setError(undefined);
  }, [repo]);

  const repositoriesResponse = useQueryWithClient(
    [QueryKey.REPOSITORIES],
    (client) => getRepositoriesService(client)
  );

  const issuesResponse = useQueryWithClient(
    [QueryKey.ISSUES_BY_REPO, repo ?? ""],
    (client) => getIssuesService(client, repo ?? ""),
    { enabled: Boolean(repo) }
  );

  const issues: Pagination<Issue> = issuesResponse.data?.success
    ? issuesResponse.data.data
    : // Fallback data to prevent the app from crashing.
      { pagelen: 0, values: [] };

  useEffect(() => {
    // Right now we only need to log the error to the user but in the future the errorCode from the result
    // could be used to redirect the user to the login page if their session expires.
    if (!issuesResponse.data?.success && repo?.trim() !== "") {
      setError(
        issuesResponse.data?.message
      );
    }
  }, [issuesResponse.data, repo]);

  return {
    error,
    isLoading: [repositoriesResponse, issuesResponse].some(
      ({ isFetching }) => isFetching
    ),
    issues: issues.values ?? [],
    repositories: repositoriesResponse.data?.values ?? [],
  };
};

export { useSearchIssues };
