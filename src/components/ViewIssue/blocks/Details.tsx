import { useMemo } from "react";
import get from "lodash/get";
import size from "lodash/size";
import { Stack } from "@deskpro/deskpro-ui";
import { Title, Property, TwoProperties } from "@deskpro/app-sdk";
import { format } from "../../../utils/date";
import {
  Member,
  Status,
  Content,
  Container,
  IssueIcon,
  IssueAttach,
  TextWithLink,
  BitbucketLogo,
  DeskproTickets,
} from "../../common";
import type { FC } from "react";
import type { Link, Issue, Attachment } from "../../../services/bitbucket/types";

type Props = {
  issue: Issue,
  attachments: Attachment[],
  onDownloadAttachment: (url: Link["href"], filename: Attachment["name"]) => Promise<void>,
};

const Details: FC<Props> = ({ issue, attachments, onDownloadAttachment }) => {
  const issueId = useMemo(() => get(issue, ["id"]), [issue]);
  const reporter = useMemo(() => get(issue, ["reporter"]), [issue]);
  const assignee = useMemo(() => get(issue, ["assignee"]), [issue]);

  return (
    <Container>
      <Title
        title={get(issue, ["title"], "-")}
        icon={<BitbucketLogo/>}
        link={get(issue, ["links", "html", "href"], "#") || "#"}
      />

      <Property
        label="Description"
        text={<Content content={get(issue, ["content"])}/>}
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

      <TwoProperties
        leftLabel="Type"
        leftText={<IssueIcon type={get(issue, ["kind"])}/>}
        rightLabel="Priority"
        rightText={<IssueIcon type={get(issue, ["priority"])}/>}
      />

      <TwoProperties
        leftLabel="Milestone"
        leftText={get(issue, ["milestone", "name"], "-") || "-"}
        rightLabel="Deskpro Tickets"
        rightText={<DeskproTickets issue={issue}/>}
      />

      <Property
        label="Author"
        text={!reporter ? "-" : (
          <Member
            name={get(reporter, ["display_name"])}
            avatarUrl={get(reporter, ["links", "avatar", "href"])}
          />
        )}
      />

      <Property
        label="Asignee"
        text={!assignee ? "-" : (
          <Member
            name={get(assignee, ["display_name"])}
            avatarUrl={get(assignee, ["links", "avatar", "href"])}
          />
        )}
      />

      <Property
        label="Attachments"
        text={!size(attachments) ? "-" : (
           <Stack gap={6} wrap="wrap">
             {attachments.map((attach) => (
               <IssueAttach
                 key={attach.name}
                 attach={attach}
                 onDownloadAttachment={onDownloadAttachment}
               />
             ))}
           </Stack>
        )}
      />
    </Container>
  );
};

export { Details };
