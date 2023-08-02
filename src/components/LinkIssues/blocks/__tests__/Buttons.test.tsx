import { cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../../../../../testing";
import { Buttons } from "../Buttons";

describe("LinkIssues", () => {
  describe("Buttons", () => {
    afterEach(() => {
      jest.clearAllMocks();
      cleanup();
    });

    test("render", async () => {
      const { findByRole } = render((
        <Buttons
          selectedIssues={[]}
          onLinkIssues={jest.fn()}
          onCancel={jest.fn()}
          isSubmitting={false}
        />
      ), { wrappers: { theme: true } });

      const linkIssuesButton = await findByRole("button", { name: "Link Issues" });
      const cancelButton = await findByRole("button", { name: "Cancel" });
      expect(linkIssuesButton).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
    });

    test("should click \"link issues\"", async () => {
      const mockOnLinkIssues = jest.fn();

      const { findByRole } = render((
        <Buttons
          selectedIssues={[{} as never]}
          onLinkIssues={mockOnLinkIssues}
          onCancel={jest.fn()}
          isSubmitting={false}
        />
      ), { wrappers: { theme: true }});

      const linkIssuesButton = await findByRole("button", { name: "Link Issues" });

      await userEvent.click(linkIssuesButton as Element);

      expect(mockOnLinkIssues).toBeCalledTimes(1);
    });

    test("should click \"Cancel\"", async () => {
      const mockOnCancel = jest.fn();

      const { findByRole } = render((
        <Buttons
          selectedIssues={[{} as never]}
          onLinkIssues={jest.fn()}
          onCancel={mockOnCancel}
          isSubmitting={false}
        />
      ), { wrappers: { theme: true }});

      const cancelButton = await findByRole("button", { name: "Cancel" });

      await userEvent.click(cancelButton as Element);

      expect(mockOnCancel).toBeCalledTimes(1);
    })
  });
});
