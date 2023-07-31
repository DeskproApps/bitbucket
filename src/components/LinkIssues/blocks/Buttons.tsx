import size from "lodash/size";
import { Stack } from "@deskpro/deskpro-ui";
import { Button } from "../../common";
import type { FC } from "react";
import type { Issue } from "../../../services/bitbucket/types";

type Props = {
  selectedIssues: Issue[],
  isSubmitting: boolean,
  onLinkIssues: () => void,
  onCancel: () => void,
};

const Buttons: FC<Props> = ({ isSubmitting, selectedIssues, onLinkIssues, onCancel }) => (
  <Stack justify="space-between">
    <Button
      type="button"
      text="Link Issues"
      disabled={!size(selectedIssues) || isSubmitting}
      loading={isSubmitting}
      onClick={onLinkIssues}
    />
    <Button
      text="Cancel"
      intent="secondary"
      onClick={onCancel}
    />
  </Stack>
);

export { Buttons };
