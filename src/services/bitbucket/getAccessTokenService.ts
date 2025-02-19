import { baseRequest } from "./baseRequest";
import { AUTH_URL } from "../../constants";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { AccessToken } from "./types";
import AccessTokenError from '../../errors/AccessTokenError';

const getAccessTokenService = async (client: IDeskproClient, code: string) => {
  const data = new FormData();
  data.append("grant_type", "authorization_code");
  data.append("code", code);

  try {
    const response = await baseRequest<AccessToken>(client, {
      rawUrl: `${AUTH_URL}/access_token`,
      method: "POST",
      headers: {
        Authorization: `Basic __key+':'+secret.base64__`,
      },
    data,
    });

    return response;
  } catch (error) {
    throw new AccessTokenError();
  };
};

export { getAccessTokenService };