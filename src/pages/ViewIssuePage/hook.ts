import { useMemo } from "react";
import get from "lodash/get";
import filter from "lodash/filter";
import { useQueryWithClient } from "@deskpro/app-sdk";
import { getIssueService, getIssueCommentsService } from "../../services/bitbucket";
import { generateEntityId } from "../../utils";
import { QueryKey } from "../../query";
import type { Maybe } from "../../types";
import type { Issue, Repository, Comment } from "../../services/bitbucket/types";

type UseIssue = (issueId: Maybe<Issue["id"]>, fullName: Maybe<Repository["full_name"]>) => {
  isLoading: boolean,
  issue: Issue,
  comments: Comment[],
};

const useIssue: UseIssue = (issueId, fullName) => {
  const pseudoIssue = {
    id: issueId as Issue["id"],
    repository: { full_name: fullName as Repository["full_name"] }
  };

  const issue = useQueryWithClient(
    [QueryKey.ISSUE, generateEntityId(pseudoIssue as Issue) as string],
    (client) => getIssueService(client, fullName as Repository["full_name"], issueId as Issue["id"]),
    { enabled: Boolean(issueId) && Boolean(fullName) },
  );

  const fetchedComments = useQueryWithClient(
    [QueryKey.ISSUE_COMMENTS, generateEntityId(pseudoIssue as Issue) as string],
    (client) => getIssueCommentsService(client, fullName as Repository["full_name"], issueId as Issue["id"]),
    { enabled: Boolean(issueId) && Boolean(fullName) },
  );

  const comments = useMemo(() => {
    const values = get(fetchedComments, ["data", "values"], []) || [] as Comment[];
    return filter(values, (comment) => {
      return Boolean(comment.content.raw);
    })
  }, [fetchedComments]);

  return {
    isLoading: [issue, fetchedComments].some(({ isLoading }) => isLoading),
    issue: get(issue, ["data"]) as Issue,
    comments,
  }
};

export { useIssue };
