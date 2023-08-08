import { createElement } from "react";
import get from "lodash/get";
import size from "lodash/size";
import { z } from "zod";
import { getOption } from "../../utils";
import { Member } from "../common";
import type {
  User,
  Issue,
  Workspace,
  Repository,
} from "../../services/bitbucket/types";
import type { AttachmentFile } from "../common/Attach";
import type { FormValidationSchema, IssueValues } from "./types";

const validationSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().optional(),
  workspace: z.string().nonempty(),
  repository: z.string().nonempty(),
  assignee: z.string().optional(),
  kind: z.union([
    z.literal("bug"),
    z.literal("enhancement"),
    z.literal("proposal"),
    z.literal("task"),
  ]).optional(),
  priority: z.union([
    z.literal("trivial"),
    z.literal("minor"),
    z.literal("major"),
    z.literal("critical"),
    z.literal("blocker"),
  ]).optional(),
  attachments: z.array(z.any()).optional(),
});

const getInitValues = (issue?: Issue): FormValidationSchema => {
  return {
    title: get(issue, ["title"], ""),
    description: get(issue, ["content", "raw"], ""),
    workspace: get(issue, ["repository", "workspace", "slug"], ""),
    repository: get(issue, ["repository", "full_name"], ""),
    assignee: get(issue, ["assignee", "uuid"], ""),
    kind: get(issue, ["kind"], "bug"),
    priority: get(issue, ["priority"], "major"),
    attachments: [],
  };
};

const getIssueValues = (values: FormValidationSchema): IssueValues => {
  return {
    title: values.title,
    ...(!values.description ? {} : { content: { markup: "markdown", raw: values.description }}),
    ...(!values.kind ? {} : { kind: values.kind }),
    ...(!values.priority ? {} : { priority: values.priority }),
    ...(!values.assignee ? {} : { assignee: { uuid: values.assignee }}),
  };
};

const getIssueRepo = (values: FormValidationSchema): Repository["full_name"] => {
  return values.repository;
};

const getIssueAttachments = (values: FormValidationSchema): void|FormData => {
  if (!Array.isArray(values.attachments) || !size(values.attachments)) {
    return;
  }

  const formData = new FormData();

  values.attachments.forEach(({ file, name }: AttachmentFile) => {
    file && formData.append(name, file);
  });

  return formData;
};

const kindOptions = [
  getOption<"bug">("bug"),
  getOption<"enhancement">("enhancement"),
  getOption<"proposal">("proposal"),
  getOption<"task">("task"),
];

const priorityOptions = [
  getOption<"trivial">("trivial"),
  getOption<"minor">("minor"),
  getOption<"major">("major"),
  getOption<"critical">("critical"),
  getOption<"blocker">("blocker"),
];

const getWorkspaceOptions = (workspaces?: Workspace[]) => {
  if (!Array.isArray(workspaces) || !size(workspaces)) {
    return [];
  }

  return workspaces.map((w: Workspace) => {
    return getOption(w.slug, w.name);
  })
};

const getRepositoryOptions = (repositories?: Repository[]) => {
  if (!Array.isArray(repositories) || !size(repositories)) {
    return [];
  }

  return repositories.map((r: Repository) => {
    return getOption(r.full_name, r.name);
  })
};

const getUserOptions = (members?: Array<{ user: User }>) => {
  if (!Array.isArray(members) || !size(members)) {
    return [];
  }

  return members.map(({ user }: { user: User }) => {
    return getOption(user.uuid, createElement(Member, {
      key: user.uuid,
      name: user.display_name,
      avatarUrl: get(user, ["links", "avatar", "href"]),
    }), user.display_name);
  })
};

export {
  kindOptions,
  getIssueRepo,
  getInitValues,
  getIssueValues,
  getUserOptions,
  priorityOptions,
  validationSchema,
  getIssueAttachments,
  getWorkspaceOptions,
  getRepositoryOptions,
};
