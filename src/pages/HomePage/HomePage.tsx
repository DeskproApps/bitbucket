import { H1 } from "@deskpro/deskpro-ui";
import { useDeskproElements } from "@deskpro/app-sdk";
import { useSetTitle, useSetBadgeCount } from "../../hooks";
import type { FC } from "react";

const HomePage: FC = () => {
  useSetTitle("Bitbucket");
  useSetBadgeCount([]);

  useDeskproElements(({ registerElement, clearElements }) => {
    clearElements();
    registerElement("refresh", { type: "refresh_button" });
    registerElement("plus", {
      type: "plus_button",
      payload: { type: "changePage", path: "/link" },
    });
    registerElement("menu", {
      type: "menu",
      items: [{
        title: "Log Out",
        payload: {
          type: "logout",
        },
      }],
    });
  });

  return (
    <H1>Home Page</H1>
  );
};

export { HomePage };
