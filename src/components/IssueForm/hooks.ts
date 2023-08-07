import { useMemo } from "react";
import get from "lodash/get";
import { useQueryWithClient } from "@deskpro/app-sdk";
import {
  getWorkspacesService,
  getRepositoriesService,
  getWorkspaceMembersService,
} from "../../services/bitbucket";
import { QueryKey } from "../../query";
import {
  getUserOptions,
  getWorkspaceOptions,
  getRepositoryOptions,
} from "./utils";
import type { Option } from "../../types";
import type { Workspace, Repository, User } from "../../services/bitbucket/types";

type UseFormDeps = (workspace?: Workspace["slug"]) => {
  isLoading: boolean,
  workspaceOptions: Array<Option<Workspace["slug"]>>,
  repositoryOptions: Array<Option<Repository["full_name"]>>,
  userOptions: Array<Option<User["uuid"]>>,
};

const useFormDeps: UseFormDeps = (workspace) => {
  const workspaces = useQueryWithClient(
    [QueryKey.WORKSPACES],
    getWorkspacesService
  );

  const repositories = useQueryWithClient(
    [QueryKey.REPOSITORIES, workspace as Workspace["slug"]],
    (client) => getRepositoriesService(client, { workspace }),
    { enabled: Boolean(workspace) },
  );

  const members = useQueryWithClient(
    [QueryKey.MEMBERS_BY_WORKSPACE, workspace as Workspace["slug"]],
    (client) => getWorkspaceMembersService(client, workspace as Workspace["slug"]),
    { enabled: Boolean(workspace) }
  );

  return {
    isLoading: [workspaces].some(({ isFetching }) => isFetching),
    workspaceOptions: useMemo(() => getWorkspaceOptions(get(workspaces, ["data", "values"])), [workspaces]),
    repositoryOptions: useMemo(() => getRepositoryOptions(get(repositories, ["data", "values"])), [repositories]),
    userOptions: useMemo(() => getUserOptions(get(members, ["data", "values"])), [members]),
  };
};

export { useFormDeps };
