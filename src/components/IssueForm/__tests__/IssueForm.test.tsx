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

  (getWorkspacesService as jest.Mock).mockResolvedValue({ values: [] });

  test("render", async () => {

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

  test("should show \"Create\" button", async () => {
    const { findByRole } = render((
        <IssueForm onSubmit={jest.fn()} />
    ), { wrappers: { theme: true, query: true }});

    const createButton = await findByRole("button", { name: "Create" });

    expect(createButton).toBeInTheDocument();
  });

  test("should show \"Save\" button", async () => {
    const { findByRole } = render((
        <IssueForm isEditMode onSubmit={jest.fn()} />
    ), { wrappers: { theme: true, query: true }});

    const saveButton = await findByRole("button", { name: "Save" });

    expect(saveButton).toBeInTheDocument();
  });

  test("render error", async () => {
    const { findByText } = render((
        <IssueForm onSubmit={jest.fn()} error="some error" />
    ), { wrappers: { theme: true, query: true } });

    expect(await findByText(/some error/)).toBeInTheDocument();
  });
});
