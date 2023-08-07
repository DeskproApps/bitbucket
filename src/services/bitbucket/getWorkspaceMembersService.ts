import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Pagination, User, Workspace } from "./types";

const getWorkspaceMembersService = (
  client: IDeskproClient,
  workspace: Workspace["slug"],
) => {
  return baseRequest<Pagination<{ user: User}>>(client, {
    url: `/workspaces/${workspace}/members`,
    queryParams: [
      "pagelen=100",
      `fields=${encodeURIComponent("-values.workspace,-values.links")}`,
    ].join("&"),
  });
};

export { getWorkspaceMembersService };
