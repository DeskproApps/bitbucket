import { useState, useCallback } from "react";
import get from "lodash/get";
import { faFile } from "@fortawesome/free-regular-svg-icons";
import { AttachmentTag, Spinner, Icon } from "@deskpro/deskpro-ui";
import type { FC, MouseEvent } from "react";
import type { Attachment, Link } from "../../../services/bitbucket/types";

type Props = {
  attach: Attachment,
  onDownloadAttachment: (url: Link["href"], filename: Attachment["name"]) => Promise<void>,
};

const IssueAttach: FC<Props> = ({ attach, onDownloadAttachment }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onDownload = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      if (isLoading) {
          return;
      }

      setIsLoading(true);

      const url = get(
          attach,
          ["links", "self", "href", 0],
          get(attach, ["links", "self", "href"], "#"),
      ) as string;

      return onDownloadAttachment(url, attach.name)
          .finally(() => setIsLoading(false));
  }, [isLoading, attach, onDownloadAttachment]);

  return (
    <AttachmentTag
      key={attach.name}
      filename={attach.name}
      fileSize={0}
      icon={isLoading
        ? <Spinner size="extra-small" color="grey80"/>
        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
        /* @ts-ignore */
        : <Icon size={12} icon={faFile} style={{ width: "12px" }}/>
      }
      href="#"
      onClick={onDownload}
    />
  );
};

export { IssueAttach };
