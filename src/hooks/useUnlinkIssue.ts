import { useState, useCallback } from "react";
import get from "lodash/get";
import { useNavigate } from "react-router-dom";
import {
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { deleteEntityService } from "../services/deskpro";
import { useAsyncError } from "./useAsyncError";
import { generateEntityId } from "../utils";
import type { TicketContext } from "../types";
import type { Issue } from "../services/bitbucket/types";

export type Result = {
  isLoading: boolean,
  unlink: (issue?: Issue) => void,
};

const useUnlinkIssue = (): Result => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext() as { context: TicketContext };
  const { asyncErrorHandler } = useAsyncError();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const ticketId = get(context, ["data", "ticket", "id"]);

  const unlink = useCallback((issue?: Issue) => {
    const issueMeta = generateEntityId(issue);

    if (!client || !issueMeta) {
      return;
    }

    setIsLoading(true);
    Promise.all([
      deleteEntityService(client, ticketId, issueMeta),
    ])
      .then(() => {
        setIsLoading(false);
        navigate("/home");
      })
      .catch(asyncErrorHandler);
  }, [client, ticketId, navigate, asyncErrorHandler]);

  return { isLoading, unlink };
};

export { useUnlinkIssue };