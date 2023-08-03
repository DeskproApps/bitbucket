import get from "lodash/get";
import { match } from "ts-pattern";
import { addBlankTargetToLinks } from "../../../utils";
import { Markdown } from "../Markdown";
import { Styled } from "../Layout";
import type { FC } from "react";
import type { Content as ContentType } from "../../../services/bitbucket/types";

type Props = {
  content?: ContentType,
};

const Content: FC<Props> = ({ content }) => {
  return match(get(content, ["markup"]))
    .with("markdown", () => (
      <Markdown text={get(content, ["raw"], "-") || "-"} />
    ))
    .otherwise(() => (
      <Styled
        type="p5"
        dangerouslySetInnerHTML={{
          __html: addBlankTargetToLinks(get(content, ["html"], "-") || "-"),
        }}
      />
    ));
};

export { Content };
