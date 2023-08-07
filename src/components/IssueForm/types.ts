import { z } from "zod";
import { validationSchema } from "./utils";
import type { Maybe } from "../../types";
import type { Issue, User } from "../../services/bitbucket/types";

export type FormValidationSchema = z.infer<typeof validationSchema>;

export type IssueValues = {
  title: Issue["title"],
  description?: Issue["content"],
  kind?: Issue["kind"],
  priority?: Issue["priority"],
  assignee?: { uuid: User["uuid"] },
};

export type Props = {
  onSubmit: (values: FormValidationSchema) => Promise<void>,
  onCancel?: () => void,
  isEditMode?: boolean,
  error?: Maybe<string|string[]>,
};
