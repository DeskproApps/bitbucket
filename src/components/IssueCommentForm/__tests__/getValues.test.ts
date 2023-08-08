import { getValues } from "../utils";

describe("IssueCommentForm", () => {
  describe("getValues", () => {
    test("should return comment values", () => {
      expect(getValues({ comment: "test comment" } as never))
        .toEqual({ content: { markup: "markdown", raw: "test comment" }});
    });
  });
});
