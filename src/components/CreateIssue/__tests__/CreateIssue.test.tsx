import { cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../../../testing";
import { CreateIssue } from "../CreateIssue";

describe("CreateIssue", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("should navigate to \"link issue\" page", async () => {
    const mockOnNavigateToLink = jest.fn();
    const { findByRole } = render((
      <CreateIssue onSubmit={jest.fn()} onNavigateToLink={mockOnNavigateToLink} />
    ), { wrappers: { theme: true, query: true }});

    const findIssueButton = await findByRole("button", { name: "Find Issue" });
    await userEvent.click(findIssueButton);

    expect(mockOnNavigateToLink).toHaveBeenCalled();
  });
});
