import { cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../../../testing";
import { LinkIssues } from "../LinkIssues";

describe("LinkIssues", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("should navigate to \"create issue\" page", async () => {
    const mockOnNavigateToCreate = jest.fn();

    const { findByRole } = render((
      <LinkIssues
        isLoading={false}
        repositories={[]}
        selectedRepository={""}
        onChangeRepository={jest.fn()}
        onCancel={jest.fn()}
        onLinkIssues={jest.fn()}
        isSubmitting={false}
        selectedIssues={[]}
        issues={[]}
        onChangeSelectedIssue={jest.fn()}
        onNavigateToCreate={mockOnNavigateToCreate}
      />
    ), { wrappers: { theme: true }});

    const createIssueButton = await findByRole("button", { name: "Create Issue" });
    await userEvent.click(createIssueButton);

    expect(mockOnNavigateToCreate).toHaveBeenCalled();
  });
});
