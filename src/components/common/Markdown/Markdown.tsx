import showdown from "showdown";
import { Styled } from "../Layout";
import type { FC } from "react";

type Props = {
  text: string,
};

const converter = new showdown.Converter({
  tables: true,
  tasklists: true,
  strikethrough: true,
  simplifiedAutoLink: true,
  openLinksInNewWindow: true,
});

const Markdown: FC<Props> = ({ text }) => (
  <Styled
    type="p5"
    dangerouslySetInnerHTML={{ __html: converter.makeHtml(text) }}
  />
);

export { Markdown };
