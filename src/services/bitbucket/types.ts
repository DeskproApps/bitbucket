export type BitbucketAuthError = {
  error: string, // "invalid_grant"
  error_description: string,
};

export type BitbucketAPIError = {
  type: "error",
  error: {
    message: string,
    detail: string, // "There is no API hosted at this URL.\n\nFor information about our API's, please refer to the documentation at: https://developer.atlassian.com/bitbucket/api/2/reference/"
  }
};

export type AccessToken = {
  token_type: "bearer",
  state: "authorization_code",
  access_token: string,
  refresh_token: string,
  expires_in: number, // 7200,
  scopes: string, // "pipeline:variable issue:write team:write snippet:write account:write wiki project:admin project:write repository:admin runner:write webhook pullrequest:write repository:delete",
};
