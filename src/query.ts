import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: false,
      useErrorBoundary: true,
      refetchOnWindowFocus: false,
    },
  },
});

enum QueryKey {
  WORKSPACES = "workspaces",
  REPOSITORIES = "repositories",
  ISSUES_BY_REPO = "issuesByRepo",
  LINKED_TASKS = "linkedTasks",
  ISSUE = "issue",
  ISSUE_COMMENTS = "issueComments",
  MEMBERS_BY_WORKSPACE = "membersByWorkspace",
}

export { queryClient, QueryKey };
