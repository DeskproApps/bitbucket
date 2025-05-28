import get from "lodash/get";
import { Stack } from "@deskpro/deskpro-ui";
import { BitbucketError } from "../../services/bitbucket";
import { isAuthError, isAPIError } from "../../utils";
import { Container, ErrorBlock } from "../common";
import { FallbackRender } from "@sentry/react";

const ErrorFallback: FallbackRender = ({ error }) => {
  let message = "There was an error!";
  const button = null;

  // eslint-disable-next-line no-console
  console.error(error);

  if (error instanceof BitbucketError) {
    message = isAuthError(error.data)
      ? get(error, ["data", "error_description"])
      : isAPIError(error.data)
      ? get(error, ["data", "error", "message"])
      : message;
  }

  return (
    <Container>
      <ErrorBlock
        text={(
          <Stack gap={6} vertical style={{ padding: "8px" }}>
            {message}
            {button}
          </Stack>
        )}
      />
    </Container>
  );
};

export { ErrorFallback };
