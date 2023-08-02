import get from "lodash/get";
import { useQueryWithClient } from "@deskpro/app-sdk";
import { getRepositoriesService, getIssuesService } from "../../services/bitbucket";
import { QueryKey } from "../../query";
import type { Repository, Issue } from "../../services/bitbucket/types";

type UseSearchIssues = (repo?: Repository["full_name"]) => {
  isLoading: boolean,
  repositories: Repository[],
  issues: Issue[],
};

const useSearchIssues: UseSearchIssues = (repo) => {
  const repositories = useQueryWithClient(
    [QueryKey.REPOSITORIES],
    (client) => getRepositoriesService(client),
  );

  const issues = useQueryWithClient(
    [QueryKey.ISSUES_BY_REPO, repo as Repository["full_name"]],
    (client) => getIssuesService(client, repo as Repository["full_name"]),
    { enabled: Boolean(repo) },
  );

  return {
    isLoading: [repositories, issues].some(({ isFetching }) => isFetching),
    repositories: get(repositories, ["data", "values"], []) || [],
    issues: get(issues, ["data", "values"], []) || [],
  };
};

export { useSearchIssues };
