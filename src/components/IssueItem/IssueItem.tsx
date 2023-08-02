import { useCallback } from "react"
import get from "lodash/get";
import { Title, TwoProperties, Property } from "@deskpro/app-sdk";
import { format } from "../../utils/date";
import {
  Link,
  Member,
  Status,
  TextWithLink,
  BitbucketLogo,
  DeskproTickets,
} from "../common";
import type { FC, MouseEventHandler } from "react";
import type { Issue } from "../../services/bitbucket/types";

type Props = {
  issue: Issue,
  onClickTitle?: () => void,
};

const IssueItem: FC<Props> = ({ issue, onClickTitle }) => {
  const issueId = get(issue, ["id"]);

  const onClick: MouseEventHandler<HTMLAnchorElement> = useCallback((e) => {
    e.preventDefault();
    onClickTitle && onClickTitle();
  }, [onClickTitle]);

  return (
    <>
      <Title
        title={!onClickTitle
          ? get(issue, ["title"], "")
          : (<Link href="#" onClick={onClick}>{get(issue, ["title"], "")}</Link>)
        }
        icon={<BitbucketLogo/>}
        link={get(issue, ["links", "html", "href"], "#") || "#"}
        marginBottom={10}
      />
      <TwoProperties
        leftLabel="Status"
        leftText={<Status status={get(issue, ["state"])} />}
        rightLabel="Date Created"
        rightText={format(get(issue, ["created_on"]))}
      />
      <TwoProperties
        leftLabel="Issue ID"
        leftText={issueId ? `#${issueId}` : "-"}
        rightLabel="Workspace"
        rightText={(
          <TextWithLink
            text={get(issue, ["repository", "workspace", "name"])}
            link={get(issue, ["repository", "workspace", "links", "html", "href"])}
          />
        )}
      />
      <TwoProperties
        leftLabel="Project"
        leftText={(
          <TextWithLink
            text={get(issue, ["repository", "project", "name"])}
            link={get(issue, ["repository", "project", "links", "html", "href"])}
          />
        )}
        rightLabel="Repository"
        rightText={(
          <TextWithLink
            text={get(issue, ["repository", "name"])}
            link={get(issue, ["repository", "links", "html", "href"])}
          />
        )}
      />
      <Property
        label="Deskpro Tickets"
        text={<DeskproTickets entityId={`${get(issue, ["id"])}`}/>}
      />
      <Property
        label="Asignees"
        text={(
          <Member
            name={get(issue, ["assignee", "display_name"])}
            avatarUrl={get(issue, ["assignee", "links", "avatar", "href"])}
          />
        )}
      />
    </>
  );
};

export { IssueItem };
