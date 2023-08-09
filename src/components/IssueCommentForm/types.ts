import { z } from "zod";
import { validationSchema } from "./utils";
import type { SubmitHandler } from "react-hook-form";
import type { Maybe } from "../../types";
import type { Content } from "../../services/bitbucket/types";

export type FormValidationSchema = z.infer<typeof validationSchema>;

export type CommentValues = {
  content: Pick<Content, "markup"|"raw">,
};

export type Props = {
  onSubmit: SubmitHandler<FormValidationSchema>,
  onCancel?: () => void,
  error?: Maybe<string|string[]>,
};
