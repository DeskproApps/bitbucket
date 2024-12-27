import type { BitbucketAPIError } from "./types";

export type InitData = {
  status: number,
  data: BitbucketAPIError,
};

class BitbucketError extends Error {
  status: number;
  data: BitbucketAPIError;

  constructor({ status, data }: InitData) {
    const message = "Bitbucket Api Error";
    super(message);

    this.data = data;
    this.status = status;
  }
}

export { BitbucketError };
