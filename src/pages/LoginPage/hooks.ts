import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import get from "lodash/get";
import size from "lodash/size";
import {
  useDeskproAppClient,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import {
  getEntityListService,
  setAccessTokenService,
  setRefreshTokenService,
} from "../../services/deskpro";
import { getAccessTokenService, getCurrentUserService } from "../../services/bitbucket";
import { getQueryParams } from "../../utils";
import { useAsyncError } from "../../hooks";
import { AUTH_URL } from "../../constants";
import type { OAuth2StaticCallbackUrl } from "@deskpro/app-sdk";
import type { TicketData, Settings } from "../../types";
import AccessTokenError from '../../errors/AccessTokenError';

type UseLogin = () => {
  poll: () => void,
  authUrl: string|null,
  isLoading: boolean,
};

const useLogin: UseLogin = () => {
  const key = useMemo(() => uuidv4(), []);
  const navigate = useNavigate();
  const [callback, setCallback] = useState<OAuth2StaticCallbackUrl|undefined>();
  const [authUrl, setAuthUrl] = useState<string|null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { context } = useDeskproLatestAppContext<TicketData, Settings>();
  const { client } = useDeskproAppClient();
  const { asyncErrorHandler } = useAsyncError();
  const clientId = useMemo(() => get(context, ["settings", "key"]), [context]);
  const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);

  useInitialisedDeskproAppClient(
    (client) => {
        client.oauth2()
          .getGenericCallbackUrl(key, /code=(?<token>[\d\w]+)/, /state=(?<key>.+)/)
          .then(setCallback);
    },
    [setCallback]
  );

  useEffect(() => {
    if (callback?.callbackUrl && clientId) {
      setAuthUrl(`${AUTH_URL}/authorize?${getQueryParams({
        client_id: clientId,
        response_type: "code",
        state: key,
      })}`);
    }
  }, [callback, clientId, key]);

  const poll = useCallback(() => {
    if (!client || !callback?.poll || !ticketId) {
      return;
    };

    setTimeout(() => setIsLoading(true), 1000);

    callback.poll()
      .then(({ token }) => getAccessTokenService(client, token))
      .then(({ access_token, refresh_token }) => Promise.all([
        setAccessTokenService(client, access_token),
        setRefreshTokenService(client, refresh_token),
      ]))
      .then(() => getCurrentUserService(client))
      .then(() => getEntityListService(client, ticketId))
      .then((entityIds) => navigate(size(entityIds) ? "/home" : "/link"))
      .catch(error => {
        if (error instanceof AccessTokenError) {
          navigate('/access-token-error');
        };

        asyncErrorHandler(error);
      });
  }, [client, callback, navigate, ticketId, asyncErrorHandler]);

  return { authUrl, poll, isLoading };
};

export { useLogin };
