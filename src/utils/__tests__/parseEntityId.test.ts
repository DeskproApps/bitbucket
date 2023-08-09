import { parseEntityId } from "../parseEntityId";

describe("generateEntityId", () => {
  test("should return issue data", () => {
    expect(parseEntityId("7/zpawn/apps-lab"))
      .toStrictEqual({ issueId: 7, repo: "zpawn/apps-lab" });
  });

  test.each([undefined, null, "", 0, true, false, {}])("wrong value: %p", (payload) => {
    expect(parseEntityId(payload as never)).toBeUndefined()
  });
});
