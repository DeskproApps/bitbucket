import isString from "lodash/isString";
import type { Issue, Repository } from "../services/bitbucket/types";

const parseEntityId = (data?: string): void|{
  repo: Repository["full_name"],
  issueId: Issue["id"],
} => {
  if (!data || !isString(data)) {
    return;
  }

  try {
    return JSON.parse(data);
  } catch (e) {
    return;
  }
};

export { parseEntityId };
