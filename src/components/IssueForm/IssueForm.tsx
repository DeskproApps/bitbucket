import has from "lodash/has";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Stack } from "@deskpro/deskpro-ui";
import { LoadingSpinner } from "@deskpro/app-sdk";
import { useFormDeps } from "./hooks";
import {
  kindOptions,
  getInitValues,
  priorityOptions,
  validationSchema,
} from "./utils";
import {
  Label,
  Select,
  Attach,
  Button,
  TextArea,
  ErrorBlock,
} from "../common";
import type { FC } from "react";
import type { Issue, Repository, Workspace, User } from "../../services/bitbucket/types";
import type { FormValidationSchema, Props } from "./types";

const IssueForm: FC<Props> = ({
  issue,
  error,
  onSubmit,
  onCancel,
  isEditMode,
}) => {
  const {
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValidationSchema>({
    defaultValues: getInitValues(issue),
    resolver: zodResolver(validationSchema),
  });
  const {
    isLoading,
    userOptions,
    workspaceOptions,
    repositoryOptions,
  } = useFormDeps(watch("workspace"));

  if (isLoading) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && <ErrorBlock text={error}/>}

      <Label htmlFor="title" label="Title" required>
        <Input
          id="title"
          type="text"
          variant="inline"
          inputsize="small"
          placeholder="Add value"
          error={has(errors, ["title", "message"])}
          value={watch("title")}
          {...register("title")}
        />
      </Label>

      <Label htmlFor="description" label="Description">
        <TextArea
          variant="inline"
          id="description"
          minHeight="auto"
          placeholder="Enter value"
          value={watch("description")}
          error={has(errors, ["description", "message"])}
          {...register("description")}
        />
      </Label>

      <Label htmlFor="workspace" label="Workspace" required>
        <Select<Workspace["slug"]>
          id="workspace"
          disabled={isEditMode}
          value={watch("workspace")}
          options={workspaceOptions}
          onChange={({ value }) => setValue("workspace", value)}
          error={has(errors, ["workspace", "message"])}
        />
      </Label>

      <Label htmlFor="repository" label="Repository" required>
        <Select<Repository["full_name"]>
          id="repository"
          disabled={isEditMode}
          value={watch("repository")}
          options={repositoryOptions}
          onChange={({ value }) => setValue("repository", value)}
          error={has(errors, ["repository", "message"])}
        />
      </Label>

      <Label htmlFor="assignee" label="Assignee">
        <Select<User["uuid"]>
          id="assignee"
          value={watch("assignee")}
          showInternalSearch
          options={userOptions}
          error={has(errors, ["assignee", "message"])}
          onChange={({ value }) => setValue("assignee", value)}
        />
      </Label>

      <Label htmlFor="kind" label="Kind">
        <Select<Issue["kind"]>
          id="kind"
          value={watch("kind")}
          options={kindOptions}
          error={has(errors, ["kind", "message"])}
          onChange={({ value }) => setValue("kind", value)}
        />
      </Label>

      <Label htmlFor="priority" label="Priority">
        <Select<Issue["priority"]>
          id="priority"
          value={watch("priority")}
          options={priorityOptions}
          error={has(errors, ["priority", "message"])}
          onChange={({ value }) => setValue("priority", value)}
        />
      </Label>

      <Label htmlFor="attachments" label="Attachments">
        <Attach
          id="attachments"
          onFiles={(files) => setValue("attachments", files)}
        />
      </Label>

      <Stack justify="space-between">
        <Button
          type="submit"
          text={isEditMode ? "Save" : "Create"}
          disabled={isSubmitting}
          loading={isSubmitting}
        />
        {onCancel && (
          <Button type="button" text="Cancel" intent="tertiary" onClick={onCancel}/>
        )}
      </Stack>
    </form>
  );
};

export { IssueForm };
