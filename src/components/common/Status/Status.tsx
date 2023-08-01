import toLower from "lodash/toLower";
import startCase from "lodash/startCase"
import { match } from "ts-pattern";
import { P5, Pill } from "@deskpro/deskpro-ui";
import { useDeskproAppTheme } from "@deskpro/app-sdk";
import type { FC } from "react";
import type { Issue } from "../../../services/bitbucket/types";

type Props = {
  status?: Issue["state"],
};

const Status: FC<Props> = ({ status }) => {
  const { theme } = useDeskproAppTheme();

  if (!status) {
    return (<P5>-</P5>);
  }

  const { color, bg } = match(toLower(status))
    .with("new", () => ({ color: theme.colors.white, bg: theme.colors.amethyst100 }))
    .with("open", () => ({ color: theme.colors.white, bg: theme.colors.grey100 }))
    .with("resolved", () => ({ color: theme.colors.white, bg: theme.colors.green100 }))
    .with("on hold", () => ({ color: theme.colors.white, bg: theme.colors.cyan100 }))
    .with("invalid", () => ({ color: theme.colors.white, bg: theme.colors.red100 }))
    .with("duplicate", () => ({ color: theme.colors.white, bg: theme.colors.amber100 }))
    .with("wontfix", () => ({ color: theme.colors.white, bg: theme.colors.red100 }))
    .with("closed", () => ({ color: theme.colors.white, bg: theme.colors.green100 }))
    .otherwise(() => ({ color: theme.colors.white, bg: theme.colors.grey40 }))

  return (
    <Pill
      label={startCase(status)}
      textColor={color}
      backgroundColor={bg}
    />
  );
};

export { Status };
