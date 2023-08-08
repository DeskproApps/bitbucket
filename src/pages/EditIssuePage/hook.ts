import get from "lodash/get";
import { useQueryWithClient } from "@deskpro/app-sdk";
import { getIssueService } from "../../services/bitbucket";
import { generateEntityId } from "../../utils";
import { QueryKey } from "../../query";
import type { Maybe } from "../../types";
import type { Issue, Repository } from "../../services/bitbucket/types";

type UseIssue = (issueId: Maybe<Issue["id"]>, repo: Maybe<Repository["full_name"]>) => {
  isLoading: boolean,
  issue: Issue,
};

const useIssue: UseIssue = (issueId, repo) => {
  const pseudoIssue = {
    id: issueId as Issue["id"],
    repository: { full_name: repo as Repository["full_name"] }
  };

  const issue = useQueryWithClient(
    [QueryKey.ISSUE, generateEntityId(pseudoIssue as Issue) as string],
    (client) => getIssueService(client, repo as Repository["full_name"], issueId as Issue["id"]),
    { enabled: Boolean(issueId) && Boolean(repo) },
  );

  return {
    isLoading: [issue].some(({ isLoading }) => isLoading),
    issue: get(issue, ["data"]) as Issue,
  }
};

export { useIssue };
