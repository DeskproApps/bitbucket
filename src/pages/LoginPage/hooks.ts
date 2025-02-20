import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import type { Settings } from '../../types';
import AccessTokenError from '../../errors/AccessTokenError';

type UseLogin = () => {
  onLogIn: () => void,
  authUrl: string,
  isLoading: boolean,
};

const useLogin: UseLogin = () => {
  const navigate = useNavigate();
  const [authUrl, setAuthUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { context } = useDeskproLatestAppContext<unknown, Settings>();
  const { asyncErrorHandler } = useAsyncError();
  const ticketId = useMemo(() => get(context, ["data", "ticket", "id"]), [context]);

  useInitialisedDeskproAppClient(async client => {
    if (context?.settings.use_deskpro_saas === undefined) return;

    const key = context.settings.key;
    const mode = context?.settings.use_deskpro_saas ? 'global' : 'local';

    if (mode === 'local' && typeof key !== 'string') return;

    const oauth2 = mode === 'global' ? await client.startOauth2Global('C5KLdwRdKdDQF2PmWs') : await client.startOauth2Local(
      ({ state }) => {
        return `${AUTH_URL}/authorize?${getQueryParams({
          client_id: key,
          state,
          response_type: 'code'
        })}`
      },
      /code=(?<code>[0-9a-zA-Z]+)/,
      async code => {
        const { access_token, refresh_token } = await getAccessTokenService(client, code);

        return {
          data: { access_token, refresh_token }
        };
      }
    );

    setAuthUrl(oauth2.authorizationUrl);

    try {
      console.log(1)
      const pollResult = await oauth2.poll();
      console.log(2, pollResult)

      await setAccessTokenService(client, pollResult.data.access_token);
      pollResult.data.refresh_token && await setRefreshTokenService(client, pollResult.data.refresh_token);
      await getCurrentUserService(client);

      const entityIDs = await getEntityListService(client, ticketId);

      navigate(size(entityIDs) ? '/home' : '/link');
    } catch (error) {
      if (error instanceof AccessTokenError) {
        navigate('/access-token-error');
      } else if (error instanceof Error) {
        asyncErrorHandler(error);
      } else {
        asyncErrorHandler(new Error('Unknown Error'));
      };
    } finally {
      setIsLoading(false);
    };
  }, []);

  const onLogIn = useCallback(() => {
    setIsLoading(true);
    window.open(authUrl, '_blank');
  }, [setIsLoading, authUrl]);

  return { authUrl, onLogIn, isLoading };
};

export { useLogin };
