import pick from "lodash/pick";
import { getIssueValues } from "../utils";
import mockValues from "./mockFormValues";

describe("IssueForm", () => {
  describe("getIssueValues", () => {
    test("should return required values", () => {
      expect(getIssueValues(pick(mockValues, ["title"]) as never))
        .toStrictEqual({ title: "Jest issue" });
    });

    test("should return full task values", () => {
      expect(getIssueValues(mockValues as never)).toStrictEqual({
        title: "Jest issue",
        content: { markup: "markdown", raw: "this is description" },
        kind: "bug",
        priority: "major",
        assignee: { uuid: "user-001" },
      });
    });
  });
});
