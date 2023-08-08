import { z } from "zod";
import get from "lodash/get";
import type { FormValidationSchema, CommentValues } from "./types";

const validationSchema = z.object({
  comment: z.string().nonempty(),
});

const getInitValues = () => ({
  comment: "",
});

const getValues = (data: FormValidationSchema): CommentValues => ({
  content: {
    markup: "markdown",
    raw: get(data, "comment", ""),
  },
});

export { getValues, getInitValues, validationSchema };
