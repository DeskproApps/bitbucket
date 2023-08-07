import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Pagination, Workspace } from "./types";

const getWorkspacesService = (client: IDeskproClient) => {
  return baseRequest<Pagination<Workspace>>(client, {
    url: "/workspaces",
    queryParams: {
      pagelen: "100",
    },
  })
};

export { getWorkspacesService };
