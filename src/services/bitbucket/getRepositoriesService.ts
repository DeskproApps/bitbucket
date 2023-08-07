import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Pagination, Repository, Workspace } from "./types";

type Options = {
  workspace?: Workspace["slug"],
};

const getRepositoriesService = (
  client: IDeskproClient,
  { workspace }: Options = {},
) => {
  return baseRequest<Pagination<Repository>>(client, {
    url: `/repositories${workspace ? `/${workspace}` : ""}`,
    queryParams: {
      pagelen: "100",
      role: "member",
    },
  });
};

export { getRepositoriesService };
