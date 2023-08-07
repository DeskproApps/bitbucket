import noop from "lodash/noop";
import { faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { TwoButtonGroup } from "@deskpro/app-sdk";
import type { FC } from "react";
import type { TwoButtonGroupProps } from "@deskpro/app-sdk";

type Props = {
  selected: TwoButtonGroupProps["selected"],
  onOneNavigate?: TwoButtonGroupProps["oneOnClick"],
  onTwoNavigate?: TwoButtonGroupProps["twoOnClick"],
};

const Navigation: FC<Props> = ({
  selected,
  onOneNavigate = noop,
  onTwoNavigate = noop,
}) => (
  <TwoButtonGroup
    selected={selected}
    oneLabel="Find Issue"
    twoLabel="Create Issue"
    oneIcon={faSearch}
    twoIcon={faPlus}
    oneOnClick={onOneNavigate}
    twoOnClick={onTwoNavigate}
  />
);

export { Navigation };
