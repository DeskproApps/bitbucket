import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1500,
      suspense: false,
      useErrorBoundary: true,
      refetchOnWindowFocus: false,
    },
  },
});

enum QueryKey {
  REPOSITORIES = "repositories",
  ISSUES_BY_REPO = "issuesByRepo",
  LINKED_TASKS = "linkedTasks",
  ISSUE = "issue",
  ISSUE_COMMENTS = "issueComments",
}

export { queryClient, QueryKey };
