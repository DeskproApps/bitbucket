import type { Maybe, DateTime } from "../../types";

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

export type Pagination<T> = {
  size?: number,
  page?: number,
  pagelen: number,
  next?: string,
  previous?: string,
  values: T,
};

export type Link = { href: string, name?: string };

export type User = {
  type: "team",
  uuid: string,
  username: string,
  display_name: string,
  links: {
    self: Link,
    avatar: Link,
    html: Link
  },
};

export type Project = {
  type: "project",
  uuid: string,
  key: string,
  name: string,
  links: {
    self: Link,
    html: Link,
    avatar: Link,
  },
};

export type Repository = {
  type: "repository",
  uuid: string,
  name: string,
  full_name: string,
  description: string,
  links: {
    self: Link,
    html: Link,
    avatar: Link,
    pullrequests: Link,
    commits: Link,
    forks: Link,
    watchers: Link,
    downloads: Link,
    clone: Link,
    hooks: Link,
  },
  is_private: boolean,
  scm: string,
  owner: User,
  created_on: DateTime,
  updated_on: DateTime,
  size: number,
  language: string,
  has_issues: boolean,
  has_wiki: boolean,
  fork_policy: "allow_forks"|"no_public_forks"|"no_forks",
  project: Project,
  mainbranch: { type: "branch", name: string },
};

export type WorkspaceShort = {
  type: "workspace",
  uuid: string,
  name: string,
  slug: string,
  links: {
    avatar: Link,
    html: Link,
    self: Link
  }
};

export type ProjectShort = {
  type: "project",
  uuid: string,
  key: string,
  name: string,
  links: {
    self: Link,
    html: Link,
    avatar: Link
  }
};

export type RepositoryShort = {
  type: "repository",
  uuid: string,
  name: string,
  full_name: string,
  links: {
    self: Link,
    html: Link,
    avatar: Link
  },
  project: ProjectShort,
  workspace: WorkspaceShort,
};


export type Issue = {
  type: "issue",
  id: number,
  title: string,
  repository: RepositoryShort,
  links: {
    self: Link,
    html: Link,
    comments: Link,
    attachments: Link,
    watch: Link,
    vote: Link,
  },
  content: {
    type: "rendered",
    raw: string,
    markup: "markdown"|"creole"|"plaintext", // "markdown",
    html: string,
  },
  reporter: User,
  assignee: User,
  created_on: DateTime,
  edited_on: Maybe<DateTime>,
  updated_on: DateTime,
  state: "submitted"|"new"|"open"|"resolved"|"on hold"|"invalid"|"duplicate"|"wontfix"|"closed", // "new",
  kind: "bug"|"enhancement"|"proposal"|"task", // "bug",
  milestone: null,
  component: null,
  priority: "trivial"|"minor"|"major"|"critical"|"blocker", // "minor",
  version: null,
  votes: number,
  watches: number,
};
