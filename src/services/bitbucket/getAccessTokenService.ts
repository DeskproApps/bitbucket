import { baseRequest } from "./baseRequest";
import { AUTH_URL } from "../../constants";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { AccessToken } from "./types";

const getAccessTokenService = (
  client: IDeskproClient,
  code: string,
) => {
  const data = new FormData();
  data.append("grant_type", "authorization_code");
  data.append("code", code);

  return baseRequest<AccessToken>(client, {
    rawUrl: `${AUTH_URL}/access_token`,
    method: "POST",
    headers: {
      // Authorization: `Basic __key ':' secret.base64__`,
      Authorization: `Basic ${btoa("8nyGFhHzbKKLhVqMuq:BdJ8SFG2ZxzPv2m3n2xnTVGV59g4jspA")}`,
    },
    data,
  });
};

export { getAccessTokenService };
