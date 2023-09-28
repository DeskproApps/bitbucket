import cloneDeep from "lodash/cloneDeep";
import { generateEntityId } from "../generateEntityId";
import { mockIssue } from "../../../testing";

describe("generateEntityId", () => {
  test("should return issue data for linking to the ticket", () => {
    expect(generateEntityId(mockIssue as never))
      .toEqual("7/zpawn/apps-lab");
  });

  test("should return undefined if isn't issue", () => {
    expect(generateEntityId()).toBeUndefined();
  });

  test("should return undefined if isn't repository full_name", () => {
    const issue = cloneDeep(mockIssue);
    issue.repository = null as never;

    expect(generateEntityId(issue as never)).toBeUndefined();
  });

  test.each([undefined, null, "", 0, true, false, {}])("wrong value: %p", (payload) => {
    expect(generateEntityId(payload as never)).toBeUndefined();
  });
});
