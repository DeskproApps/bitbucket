import { match } from "ts-pattern";
import startCase from "lodash/startCase";
import { P5, Icon, Stack } from "@deskpro/deskpro-ui";
import {
  Bug,
  Task,
  Major,
  Minor,
  Trivial,
  Blocker,
  Critical,
  Proposal,
  Enhancement,
} from "./icons";
import type { FC } from "react";
import type { Issue } from "../../../services/bitbucket/types";

type Props = {
  type: Issue["kind"] | Issue["priority"],
  size?: number;
};

const IssueIcon: FC<Props> = ({ type, size = 16 }) => {
  if (!type) {
    return (
      <P5>-</P5>
    );
  }

  const icon = match(type)
    // kind
    .with("bug", () => <Bug size={size}/>)
    .with("enhancement", () => <Enhancement size={size}/>)
    .with("proposal", () => <Proposal size={size}/>)
    .with("task", () => <Task size={size}/>)
    // priority
    .with("trivial", () => <Trivial size={size}/>)
    .with("minor", () => <Minor size={size}/>)
    .with("major", () => <Major size={size}/>)
    .with("critical", () => <Critical size={size}/>)
    .with("blocker", () => <Blocker size={size}/>)
    .run();

  return (
    <Stack align="center" gap={6}>
      {icon && <Icon icon={icon} size={size}/>}
      <P5>{startCase(type)}</P5>
    </Stack>
  );
};

export { IssueIcon };
