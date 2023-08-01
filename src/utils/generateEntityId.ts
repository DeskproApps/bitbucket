import get from "lodash/get";
import type { Issue } from "../services/bitbucket/types";

const generateEntityId = (issue?: Issue): string|void => {
  const issueId = get(issue, ["id"]);
  const fullName = get(issue, ["repository", "full_name"]);

  if (!issueId || !fullName) {
    return;
  }

  try {
    return JSON.stringify({ issueId, fullName });
  } catch (e) {
    return;
  }
};

export { generateEntityId };
