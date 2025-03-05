/** Typo */
export const nbsp = "\u00A0";

/** Date */
export const DATE_FORMAT = "dd MMM, yyyy";

export const TIME_FORMAT = "H:mm";

/** Deskpro */
export const APP_PREFIX = "bitbucket";

export const ENTITY = "linkedBitbucketIssue";

export const ACCESS_TOKEN_PATH = "oauth2/access_token";
export const REFRESH_TOKEN_PATH = "oauth2/refresh_token";

export const placeholders = {
  ACCESS_TOKEN: `[user[${ACCESS_TOKEN_PATH}]]`,
  REFRESH_TOKEN: `[user[${REFRESH_TOKEN_PATH}]]`,
  KEY: "__key__",
  SECRET: "__secret__",
};

export const GLOBAL_CLIENT_ID = '5d4xDfqU3QVLUGZRxK';

/** Bitbucket */
export const BITBUCKET_URL = "https://api.bitbucket.org/2.0";
export const AUTH_URL = "https://bitbucket.org/site/oauth2";
