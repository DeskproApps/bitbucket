import { cleanup } from "@testing-library/react";
import { render } from "../../../../testing";
import { getWorkspacesService } from "../../../services/bitbucket";
import { IssueForm } from "../IssueForm";

jest.mock("../../../services/bitbucket/getWorkspacesService");

describe("IssueForm", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("render", async () => {
    (getWorkspacesService as jest.Mock).mockResolvedValueOnce({ values: [] });

    const { findByText } = render((
      <IssueForm onSubmit={jest.fn()} />
    ), { wrappers: { theme: true, query: true }});

    expect(await findByText(/Title/i)).toBeInTheDocument();
    expect(await findByText(/Description/i)).toBeInTheDocument();
    expect(await findByText(/Workspace/i)).toBeInTheDocument();
    expect(await findByText(/Repository/i)).toBeInTheDocument();
    expect(await findByText(/Assignee/i)).toBeInTheDocument();
    expect(await findByText(/Kind/i)).toBeInTheDocument();
    expect(await findByText(/Priority/i)).toBeInTheDocument();
    expect(await findByText(/Attachments/i)).toBeInTheDocument();
  });
});
