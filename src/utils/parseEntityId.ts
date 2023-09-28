import isString from "lodash/isString";
import split from "lodash/split";
import type { Issue, Repository } from "../services/bitbucket/types";

const parseEntityId = (data?: string): void|{
  repo: Repository["full_name"],
  issueId: Issue["id"],
} => {
  if (!data || !isString(data)) {
    return;
  }

  const [issueId, workspace, repo] = split(data, "/");

  return {
    issueId: Number(issueId),
    repo: `${workspace}/${repo}`,
  };
};

export { parseEntityId };
