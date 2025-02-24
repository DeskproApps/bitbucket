import { H3 } from "@deskpro/deskpro-ui";
import { Title } from "@deskpro/app-sdk";
import { Container, AnchorButton } from "../common";
import type { FC } from "react";

type Props = {
  authUrl: string,
  onLogin: () => void,
  isLoading: boolean,
};

const Login: FC<Props> = ({ authUrl, onLogin, isLoading }) => (
  <Container>
    <Title as={H3} title="Log into your Bitbucket Account" />
    <AnchorButton
      intent="secondary"
      text="Log In"
      target="_blank"
      href={authUrl || "#"}
      onClick={onLogin}
      loading={isLoading}
      disabled={!authUrl || isLoading}
    />
  </Container>
);

export { Login };
