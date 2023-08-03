import React from "react";
import styled from "styled-components";
import ReactTimeAgo from "react-time-ago";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Avatar, P11, Stack } from "@deskpro/deskpro-ui";
import type { FC, ReactNode } from "react";
import type { AnyIcon } from "@deskpro/deskpro-ui";
import type { Maybe } from "../../../types";

const TimeAgo = styled(ReactTimeAgo)`
  color: ${({ theme }) => theme.colors.grey80};
`;

const Author = styled(Stack)`
  width: 35px;
`;

const Body = styled(Stack)`
  width: calc(100% - 35px);
`;

type Props = {
  name: string,
  text: string|ReactNode,
  date?: Maybe<Date>,
  avatarUrl?: string,
};

const Comment: FC<Props> = ({ name, avatarUrl, text, date }) => {
  return (
    <Stack wrap="nowrap" gap={6} style={{ marginBottom: 10 }}>
      <Author vertical>
        <Avatar
          size={18}
          name={name}
          backupIcon={faUser as AnyIcon}
          imageUrl={avatarUrl}
        />
        {date && (
          <P11>
            <TimeAgo date={date} timeStyle="mini"/>
          </P11>
        )}
      </Author>
      <Body>{text}</Body>
    </Stack>
  );
};

export { Comment };
