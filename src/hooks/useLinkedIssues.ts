import { useMemo } from "react";
import get from "lodash/get";
import size from "lodash/size";
import { useQueryWithClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { getEntityListService } from "../services/deskpro";
import { getIssueService } from "../services/bitbucket";
import { useQueriesWithClient } from "./useQueriesWithClient";
import { parseEntityId } from "../utils";
import { QueryKey } from "../query";
import type { TicketContext } from "../types";
import type { Issue } from "../services/bitbucket/types";

type UseLinkedIssues = () => {
  isLoading: boolean;
  issues: Issue[];
};

const useLinkedIssues: UseLinkedIssues = () => {
  const { context } = useDeskproLatestAppContext() as { context: TicketContext };
  const ticketId = get(context, ["data", "ticket", "id"]);

  const linkedIds = useQueryWithClient(
    [QueryKey.LINKED_TASKS, ticketId],
    (client) => ticketId ? getEntityListService(client, ticketId) : Promise.resolve([]),
    { enabled: Boolean(ticketId) }
  );

  const fetchedIssues = useQueriesWithClient((get(linkedIds, ["data"], []) || []).map((issueMeta) => {
    const meta = parseEntityId(issueMeta);
    return {
      queryKey: [QueryKey.ISSUE, issueMeta],
      queryFn: (client) => (!meta
        ? Promise.resolve(undefined)
        : getIssueService(client, meta.repo, meta.issueId)
      ),
      enabled: Boolean(size(linkedIds)),
      useErrorBoundary: false
    }
  }));

  const issues = useMemo<Issue[]>(() => {
    return fetchedIssues.map(({ data }) => data).filter((issue): issue is Issue => Boolean(issue));
  }, [fetchedIssues]);

  return {
    isLoading: [linkedIds, ...fetchedIssues].some(({ isLoading, isFetching }) => isLoading || isFetching),
    issues
  };
};

export { useLinkedIssues };
