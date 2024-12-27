import { useMemo } from "react";
import { getOption } from "../../../utils";
import { Select, Label } from "../../common";
import type { FC, Dispatch } from "react";
import type { Repository } from "../../../services/bitbucket/types";

type Props = {
  repositories: Repository[],
  selectedRepository: Repository["full_name"],
  onChangeRepository: Dispatch<Repository["full_name"]>,
};

const Filters: FC<Props> = ({
  repositories,
  onChangeRepository,
  selectedRepository,
}) => {
  const workspaceOptions = useMemo(() => {
    return (!Array.isArray(repositories) ? [] : repositories)
      .map(({ full_name }) => getOption(full_name, full_name));
  }, [repositories]);

  return (
    <>
      <Label label="Repository" required>
        <Select<Repository["full_name"]>
          id="Repository"
          showInternalSearch
          value={selectedRepository}
          options={workspaceOptions}
          onChange={(o) => onChangeRepository(o.value)}
          noFoundText="No repository(s) found"
        />
      </Label>
    </>
  );
};

export { Filters };
