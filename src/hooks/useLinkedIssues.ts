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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    [QueryKey.LINKED_TASKS, ticketId],
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (client) => getEntityListService(client, ticketId),
    { enabled: Boolean(ticketId) }
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const fetchedIssues = useQueriesWithClient((get(linkedIds, ["data"], []) || []).map((issueMeta) => {
    const meta = parseEntityId(issueMeta);
    return {
      queryKey: [QueryKey.ISSUE, issueMeta],
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      queryFn: (client) => (!meta
        ? Promise.resolve()
        : getIssueService(client, meta.repo, meta.issueId)
      ) as Promise<void|Issue>,
      enabled: Boolean(size(linkedIds)),
      useErrorBoundary: false,
    }
  }));

  const issues = useMemo(() => {
    return fetchedIssues.map(({ data }) => data).filter(Boolean)
  }, [fetchedIssues]);

  return {
    isLoading: [linkedIds, ...fetchedIssues].some(({ isLoading, isFetching }) => isLoading || isFetching),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    issues: issues as Issue[],
  };
};

export { useLinkedIssues };
