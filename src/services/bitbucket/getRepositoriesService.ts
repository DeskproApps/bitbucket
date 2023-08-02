import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { Pagination, Repository } from "./types";

const getRepositoriesService = (client: IDeskproClient) => {
  return baseRequest<Pagination<Repository>>(client, {
    url: "/repositories",
    queryParams: {
      pagelen: "100",
      role: "member",
    },
  });
};

export { getRepositoriesService };
