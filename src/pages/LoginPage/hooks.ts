import { useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import {
  IOAuth2,
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
import { AUTH_URL, GLOBAL_CLIENT_ID } from '../../constants';
import type { Settings, TicketData } from '../../types';
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
  const { context } = useDeskproLatestAppContext<TicketData, Settings>();
  const { asyncErrorHandler } = useAsyncError();
  const [isPolling, setIsPolling] = useState(false);
  const [oAuth2Context, setOAuth2Context] = useState<IOAuth2 | null>(null);

  useInitialisedDeskproAppClient(async client => {
    if (context?.settings.use_advanced_connect === undefined) {
      return;
    };

    const key = context.settings.key;
    const mode = context?.settings.use_advanced_connect ? 'local' : 'global';

    if (mode === 'local' && typeof key !== 'string') {
      return;
    };

    const oauth2Response = mode === 'global' ? await client.startOauth2Global(GLOBAL_CLIENT_ID) : await client.startOauth2Local(
      ({ state }) => {
        return `${AUTH_URL}/authorize?${getQueryParams({
          client_id: key,
          state,
          response_type: 'code'
        })}`;
      },
      /code=(?<code>[0-9a-zA-Z]+)/,
      async code => {
        const { access_token, refresh_token } = await getAccessTokenService(client, code);

        return {
          data: { access_token, refresh_token }
        };
      }
    );

    setAuthUrl(oauth2Response.authorizationUrl);
    setOAuth2Context(oauth2Response);
  }, [context]);

  useInitialisedDeskproAppClient(client => {
    const ticketID = context?.data?.ticket.id;

    if (!oAuth2Context || !ticketID) {
      return;
    };

    const startPolling = async () => {
      try {
        const pollResult = await oAuth2Context.poll();

        await setAccessTokenService(client, pollResult.data.access_token);
        pollResult.data.refresh_token && await setRefreshTokenService(client, pollResult.data.refresh_token);
        await getCurrentUserService(client);

        const entityIDs = await getEntityListService(client, ticketID);

        navigate(entityIDs.length > 0 ? '/home' : '/link');
      } catch (error) {
        if (error instanceof AccessTokenError) {
          navigate('/access-token-error');
        } else if (error instanceof Error) {
          asyncErrorHandler(error);
        } else {
          asyncErrorHandler(new Error('Unknown Error'));
        };
      } finally {
        setIsPolling(false);
        setIsLoading(false);
      };
    };

    if (isPolling) {
      startPolling();
    };
  }, [context, oAuth2Context, navigate, isPolling]);

  const onLogIn = useCallback(() => {
    setIsLoading(true);
    setIsPolling(true);
    window.open(authUrl, '_blank');
  }, [setIsLoading, authUrl]);

  return { authUrl, onLogIn, isLoading };
};

export { useLogin };