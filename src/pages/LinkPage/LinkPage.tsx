import { H1 } from "@deskpro/deskpro-ui";
import { useDeskproElements } from "@deskpro/app-sdk";
import { useSetTitle } from "../../hooks";
import type { FC } from "react";

const LinkPage: FC = () => {
  useSetTitle("Link Issues");

  useDeskproElements(({ clearElements, registerElement }) => {
    clearElements();
    registerElement("refresh", {type: "refresh_button"});
    registerElement("home", {
      type: "home_button",
      payload: {type: "changePage", path: "/home"},
    });
  });

  return (
    <H1>LinkPage</H1>
  );
};

export { LinkPage };
