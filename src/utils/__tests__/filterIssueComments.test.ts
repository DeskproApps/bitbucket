import { filterIssueComments } from "../filterIssueComments";
import { mockIssueComments } from "../../../testing";

describe("filterIssueComments", () => {
  test("should return filtered issue comments", () => {
    const result = filterIssueComments(mockIssueComments.values as never);

    expect(result).toHaveLength(4);
    expect(result).toMatchObject([
      { content: { raw: "### Lina Kostenko" }},
      { content: { raw: "### Lesya Ukrainka" }},
      { content: { raw: "### Ivan Franko" }},
      { content: { raw: "### Taras Shevchenko" }},
    ]);
  });

  test("should return empty issue comments", () => {
    expect(filterIssueComments([])).toStrictEqual([]);
  });

  test.each([undefined, null, "", 0, true, false, {}])("wrong value: %p", (payload) => {
    expect(filterIssueComments(payload as never)).toStrictEqual([]);
  });
});
