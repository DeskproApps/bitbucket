import { useMemo } from "react";
import get from "lodash/get";
import { useQueryWithClient } from "@deskpro/app-sdk";
import {
  getIssueService,
  getIssueCommentsService,
  getIssueAttachmentsService,
} from "../../services/bitbucket";
import {
  generateEntityId,
  filterIssueComments,
  retryUntilHavePagination,
} from "../../utils";
import { QueryKey } from "../../query";
import type { Maybe } from "../../types";
import type { Issue, Repository, Comment, Attachment } from "../../services/bitbucket/types";

type UseIssue = (issueId: Maybe<Issue["id"]>, repo: Maybe<Repository["full_name"]>) => {
  isLoading: boolean,
  issue: Issue,
  comments: Comment[],
  attachments: Attachment[],
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

  const retryIssueCommentsService = retryUntilHavePagination<Comment>(getIssueCommentsService);

  const fetchedComments = useQueryWithClient(
      [`retry${QueryKey.ISSUE_COMMENTS}`, generateEntityId(pseudoIssue as Issue) as string],
      (client) => retryIssueCommentsService(client, {
        repo: repo as Repository["full_name"],
        issueId: issueId as Issue["id"],
      }),
      {
        enabled: Boolean(issueId) && Boolean(repo),
        cacheTime: 0,
        staleTime: 0,
      },
  );

  const comments = useMemo(() => {
    return filterIssueComments(get(fetchedComments, ["data", "values"]));
  }, [fetchedComments]);

  const attachments = useQueryWithClient(
    [QueryKey.ISSUE_ATTACHMENTS, generateEntityId(pseudoIssue as Issue) as string],
    (client) => getIssueAttachmentsService(client, repo as Repository["full_name"], issueId as Issue["id"]),
    { enabled: Boolean(issueId) && Boolean(repo) },
  );

  return {
    isLoading: [issue, fetchedComments, attachments].some(({ isLoading }) => isLoading),
    issue: get(issue, ["data"]) as Issue,
    comments,
    attachments: (get(attachments, ["data", "values"], []) || []) as Attachment[],
  }
};

export { useIssue };
