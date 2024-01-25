import { baseRequest } from "./baseRequest";
import { AUTH_URL, placeholders } from "../../constants";
import { getQueryParams } from "../../utils";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { AccessToken } from "./types";

const refreshTokenService = (client: IDeskproClient) => {
  const form = new FormData();
  form.append("grant_type", "refresh_token");
  form.append("refresh_token", placeholders.REFRESH_TOKEN);

  return baseRequest<AccessToken>(client, {
    rawUrl: `${AUTH_URL}/access_token`,
    method: "POST",
    headers: {
      Authorization: `Basic __key+':'+secret.base64__`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: getQueryParams(form),
  });
};

export { refreshTokenService };
