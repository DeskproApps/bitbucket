import { getFilteredIssues } from "../getFilteredIssues";

describe("getFilteredIssues", () => {
  test("should return empty issue list if empty issues", () => {
    expect(getFilteredIssues([], {})).toStrictEqual([]);
  });

  test("should return filtered issues by title", () => {
    expect(getFilteredIssues([
      { id: "issue001", title: "Link page" },
      { id: "issue002", title: "Home page" },
      { id: "issue003", title: "View page" },
    ] as never, { query: "link" })).toEqual([
      { id: "issue001", title: "Link page" },
    ]);
  });

  test("should return filtered issues by issueId", () => {
    expect(getFilteredIssues([
      { id: "issue001", title: "Link page" },
      { id: "issue002", title: "Home page" },
      { id: "issue003", title: "View page" },
    ] as never, { query: "issue002" })).toEqual([
      { id: "issue002", title: "Home page" },
    ]);
  });
});
