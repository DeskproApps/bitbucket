import get from "lodash/get";
import size from "lodash/size";
import { useNavigate } from "react-router-dom";
import {
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import {
  getEntityListService,
  // setAccessTokenService,
  // setRefreshTokenService,
} from "../../services/deskpro";
import { getCurrentUserService, refreshTokenService } from "../../services/bitbucket";
import type { TicketContext } from "../../types";
// import type { AccessToken } from "../../services/bitbucket/types";

type UseCheckAuth = () => void;

const useCheckAuth: UseCheckAuth = () => {
  const navigate = useNavigate();
  const { context } = useDeskproLatestAppContext() as { context: TicketContext };
  const ticketId = get(context, ["data", "ticket", "id"]);

  useInitialisedDeskproAppClient((client) => {
    if (!ticketId) {
      return;
    }

    getCurrentUserService(client)
      .catch(() => refreshTokenService(client))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // .then(({ access_token, refresh_token }) => {
      //   return Promise.all([
      //     setAccessTokenService(client, access_token),
      //     setRefreshTokenService(client, refresh_token),
      //   ]).then(() => getCurrentUserService(client))
      // })
      .then(() => getEntityListService(client, ticketId))
      .then((entityIds) => navigate(size(entityIds) ? "/home" : "/link"))
      .catch(() => navigate("/login"));
  }, [ticketId, navigate]);
};

export { useCheckAuth };
