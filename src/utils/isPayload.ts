import has from "lodash/has";
import type { EventPayload, NavigateToChangePage } from "../types";
import type { BitbucketRestAPIError, BitbucketAuthError } from "../services/bitbucket/types";

const isNavigatePayload = (
  payload: EventPayload
): payload is NavigateToChangePage => {
  return has(payload, ["path"]);
};

const isAuthError = (
  error: BitbucketRestAPIError|BitbucketAuthError,
): error is BitbucketAuthError => {
  return has(error, ["error_description"]);
};

const isAPIError = (
  error: BitbucketRestAPIError|BitbucketAuthError,
): error is BitbucketRestAPIError => {
  return has(error, ["error", "message"]);
};

export { isNavigatePayload, isAuthError, isAPIError };
