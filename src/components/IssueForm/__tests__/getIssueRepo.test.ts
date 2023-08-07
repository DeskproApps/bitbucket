import { getIssueRepo } from "../utils";
import mockValues from "./mockFormValues";

describe("IssueForm", () => {
  describe("getIssueRepo", () => {
    test("should return repository", () => {
      expect(getIssueRepo(mockValues as never)).toEqual("zpawn/apps-lab");
    });
  });
});
