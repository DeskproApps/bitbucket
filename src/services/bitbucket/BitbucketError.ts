import type { BitbucketAuthError, BitbucketAPIError } from "./types";

export type InitData = {
  status: number;
  data: BitbucketAPIError;
};

class BitbucketError extends Error {
  status: number;
  data: BitbucketAuthError | BitbucketAPIError;

  constructor({ status, data }: InitData) {
    const message = "Bitbucket Api Error";
    super(message);

    this.data = data;
    this.status = status;
  }
}

function isBitbucketAPIError(data: unknown): data is BitbucketAPIError {
  if (!data) {
    return false;
  }

  return data && typeof data === "object" && "error" in data;
}

export { BitbucketError, isBitbucketAPIError };
