import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";

const getCurrentUserService = (client: IDeskproClient) => {
  return baseRequest(client, {
    url: "/user",
  });
};

export { getCurrentUserService };
