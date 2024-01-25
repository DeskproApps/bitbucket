import { isEmpty, isString } from "lodash";
import { match } from "ts-pattern";
import { proxyFetch } from "@deskpro/app-sdk";
import { BITBUCKET_URL, placeholders } from "../../constants";
import { getQueryParams } from "../../utils";
import { BitbucketError } from "./BitbucketError";
import type { Request, FetchOptions } from "../../types";

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
  const options: FetchOptions = {
    method,
    headers: {
      "Authorization": `Bearer ${placeholders.ACCESS_TOKEN}`,
      ...customHeaders,
    },
  };

  if (!isEmpty(data)) {
    options.body = isString(data) ? data as string : JSON.stringify(data);
    options.headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };
  }

  const res = await dpFetch(requestUrl, options);

  if (res.status < 200 || res.status > 399) {
    throw new BitbucketError({
      status: res.status,
      data: await res.json(),
    });
  }

  try {
    return await match(type)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .with("blob", () => res.blob() as never)
      .otherwise(() => res.json());
  } catch (e) {
    return {};
  }
};

export { baseRequest };
