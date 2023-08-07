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
        kind: "bug",
        priority: "major",
        assignee: { uuid: "user-001" },
      });
    });
  });
});
