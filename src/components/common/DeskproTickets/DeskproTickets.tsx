import { useState } from "react";
import noop from "lodash/noop";
import { P5 } from "@deskpro/deskpro-ui";
import { useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { getEntityAssociationCountService } from "../../../services/deskpro";
import { generateEntityId } from "../../../utils";
import type { FC } from "react";
import type { Issue } from "../../../services/bitbucket/types";

type Props = { issue: Issue };

const DeskproTickets: FC<Props> = ({ issue }) => {
  const [ticketCount, setTicketCount] = useState<number>(0);

  useInitialisedDeskproAppClient((client) => {
    const issueId = generateEntityId(issue);

    if (!issueId) {
      return;
    }

    getEntityAssociationCountService(client, issueId)
      .then(setTicketCount)
      .catch(noop);
  });

  return <P5>{ticketCount}</P5>;
};

export { DeskproTickets };
