import { getInitValues } from "../utils";

describe("IssueCommentForm", () => {
  describe("getInitValues", () => {
    test("should return comment values", () => {
      expect(getInitValues()).toEqual({ comment: "" });
    });
  });
});
