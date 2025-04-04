import type { To, ParamKeyValuePair } from "react-router-dom";
import type { DropdownValueType } from "@deskpro/deskpro-ui";
import type { Context, IDeskproClient } from "@deskpro/app-sdk";
import type { Issue } from "./services/bitbucket/types";

/** Common types */
export type Maybe<T> = T | undefined | null;

export type Dict<T> = Record<string, T>;

export type Option<Value = unknown> = Omit<
  DropdownValueType<Value>,
  "subItems"
>;

/** An ISO-8601 encoded UTC date time string. Example value: `""2019-09-07T15:50:00Z"` */
export type DateTime = string;

/** Request types */
export type ApiRequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export type HttpResponseType = "json" | "blob";

export type RequestParams = {
  url?: string;
  rawUrl?: string;
  method?: ApiRequestMethod;
  data?: object | string;
  type?: HttpResponseType;
  headers?: Dict<string>;
  queryParams?: string | Dict<string> | ParamKeyValuePair[];
};

export type Request = <T>(
  client: IDeskproClient,
  params: RequestParams
) => Promise<T>;

interface SuccessResult<TData = unknown> {
  success: true;
  message?: string;
  data: TData;
}

interface FailResult<TError = unknown> {
  success: false;
  message: string;
  errorCode?: string;
  error: TError;
}

export type Result<TData = unknown, TError = unknown> =
  | SuccessResult<TData>
  | FailResult<TError>;

/** Deskpro types */
export type Settings = {
  use_advanced_connect: boolean;
  key: string;
};

export type TicketData = {
  ticket: {
    id: string;
    subject: string;
    permalinkUrl: string;
  };
};

export type TicketContext = Context<TicketData, Maybe<Settings>>;

export type NavigateToChangePage = { type: "changePage"; path: To };

export type EventPayload =
  | NavigateToChangePage
  | { type: "logout" }
  | { type: "unlink"; issue: Issue };

/** Entities */
