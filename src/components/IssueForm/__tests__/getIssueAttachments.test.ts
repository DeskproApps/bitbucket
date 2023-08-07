import { getIssueAttachments } from "../utils";
import mockValues, { file1, file2 } from "./mockFormValues";

describe("IssueForm", () => {
  describe("getIssueAttachments", () => {
    test("should return undefined if no attachments", () => {
      expect(getIssueAttachments({} as never)).toBeUndefined();
    });

    test("should return files", () => {
      const formDataFiles = getIssueAttachments(mockValues as never) as FormData;

      expect(formDataFiles.get("file-01.txt")).toEqual(file1);
      expect(formDataFiles.get("file-02.txt")).toEqual(file2);
    });
  });
});
