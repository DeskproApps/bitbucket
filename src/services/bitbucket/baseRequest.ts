import isEmpty from "lodash/isEmpty";
import { match } from "ts-pattern";
import { proxyFetch } from "@deskpro/app-sdk";
import { BITBUCKET_URL, placeholders } from "../../constants";
import { getQueryParams } from "../../utils";
import { BitbucketError } from "./BitbucketError";
import type { Request } from "../../types";

const baseRequest: Request = async (client, {
  url,
  rawUrl,
  data = {},
  type = "json",
  method = "GET",
  queryParams = {},
  headers: customHeaders,
}) => {
  const dpFetch = await proxyFetch(client);

  const baseUrl = rawUrl ? rawUrl : `${BITBUCKET_URL}${url}`;
  const params = getQueryParams(queryParams);

  const requestUrl = `${baseUrl}?${params}`;
  const options: RequestInit = {
    method,
    headers: {
      "Authorization": `Bearer ${placeholders.ACCESS_TOKEN}`,
      ...customHeaders,
    },
  };

  if (typeof data === 'string') {
    options.body = data;
  } else if (!isEmpty(data)) {
    options.body = JSON.stringify(data);
    options.headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };
  };

  const res = await dpFetch(requestUrl, options);

  if (res.status < 200 || res.status > 399) {
    throw new BitbucketError({
      status: res.status,
      data: await res.json(),
    });
  }

  try {
    return await match(type)
      .with("blob", () => res.blob() as never)
      .otherwise(() => res.json());
  } catch (e) {
    return {};
  }
};

export { baseRequest };
