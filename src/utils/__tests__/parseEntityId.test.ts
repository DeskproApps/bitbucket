import { parseEntityId } from "../parseEntityId";

describe("generateEntityId", () => {
  test("should return issue data", () => {
    expect(parseEntityId("{\"issueId\":1,\"repo\":\"zpawn/apps-lab\"}"))
      .toStrictEqual({ issueId: 1, repo: "zpawn/apps-lab" });
  });

  test.each([undefined, null, "", 0, true, false, {}])("wrong value: %p", (payload) => {
    expect(parseEntityId(payload as never)).toBeUndefined()
  });
});
