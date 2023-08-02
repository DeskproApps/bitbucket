import get from "lodash/get";
import toLower from "lodash/toLower";
import type { Issue } from "../services/bitbucket/types";

type Options = {
  query?: string,
};

const getFilteredIssues = (issues: Issue[], options: Options) => {
  const query = get(options, ["query"]);

  if (!query) {
    return issues;
  }

  let filteredIssues: Issue[] = [];

  if (query) {
    filteredIssues = issues.filter(({ id, title }) => {
      const issueTitle = toLower(title);
      const search = toLower(query);

      return issueTitle.includes(search) || `${id}`.includes(search);
    })
  }

  return filteredIssues;
};

export { getFilteredIssues };
