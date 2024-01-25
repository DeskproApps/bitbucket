import { baseRequest } from "./baseRequest";
import { AUTH_URL } from "../../constants";
import { getQueryParams } from "../../utils";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { AccessToken } from "./types";

const getAccessTokenService = (client: IDeskproClient, code: string) => {
  const data = new FormData();
  data.append("grant_type", "authorization_code");
  data.append("code", code);

  return baseRequest<AccessToken>(client, {
    rawUrl: `${AUTH_URL}/access_token`,
    method: "POST",
    headers: {
      Authorization: `Basic __key+':'+secret.base64__`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: getQueryParams(data),
  });
};

export { getAccessTokenService };
