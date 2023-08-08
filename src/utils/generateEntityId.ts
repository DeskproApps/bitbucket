import get from "lodash/get";
import type { Issue } from "../services/bitbucket/types";

const generateEntityId = (issue?: Issue): string|void => {
  const issueId = get(issue, ["id"]);
  const repo = get(issue, ["repository", "full_name"]);

  if (!issueId || !repo) {
    return;
  }

  try {
    return JSON.stringify({ issueId, repo });
  } catch (e) {
    return;
  }
};

export { generateEntityId };
