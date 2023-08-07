export const file1 = new File(["file content 1"], "file-01.txt", { type: "text/plain" });
export const file2 = new File(["file content 2"], "file-02.txt", { type: "text/plain" });

export default {
  title: "Jest issue",
  description: "this is description",
  workspace: "zpawn",
  repository: "zpawn/apps-lab",
  assignee: "user-001",
  kind: "bug",
  priority: "major",
  attachments: [
    { name: "file-01.txt", file: file1 },
    { name: "file-02.txt", file: file2 },
  ],
}
