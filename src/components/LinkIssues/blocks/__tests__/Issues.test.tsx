import { cleanup } from "@testing-library/react";
import { render, mockIssues } from "../../../../../testing";
import { Issues } from "../Issues";

jest.mock("../../../common/DeskproTickets/DeskproTickets", () => ({
  DeskproTickets: () => <>100500</>,
}));

describe("LinkIssues", () => {
  describe("Issues", () => {
    afterEach(() => {
      jest.clearAllMocks();
      cleanup();
    });

    test("render", async () => {
      const { findByText } = render((
        <Issues
          issues={mockIssues.values as never[]}
          selectedIssues={[]}
          isLoading={false}
          onChangeSelectedIssue={jest.fn()}
        />
      ), { wrappers: { theme: true }});

      expect(await findByText(/Classic issue in the Public repo/i)).toBeInTheDocument();
      expect(await findByText(/\[blocker\] Bug with migrations/i)).toBeInTheDocument();
      expect(await findByText(/\[enhancement\] Issue with another kind/i)).toBeInTheDocument();
      expect(await findByText(/\[enhancement\] Enhancement Issue/i)).toBeInTheDocument();
      expect(await findByText(/\[proposal\] Proposal kind/i)).toBeInTheDocument();
      expect(await findByText(/\[task\] issue with task kind/i)).toBeInTheDocument();
    });

    test("should show \"No found\" id wrong issues", async () => {
      const { findByText } = render((
        <Issues
          issues={{} as never}
          selectedIssues={[]}
          isLoading={false}
          onChangeSelectedIssue={jest.fn()}
        />
      ), { wrappers: { theme: true }});

      expect(await findByText(/No found/i)).toBeInTheDocument();
    });

    test("should show \"No Bitbucket issues found\" if no issues", async () => {
      const { findByText } = render((
        <Issues
          issues={[] as never}
          selectedIssues={[]}
          isLoading={false}
          onChangeSelectedIssue={jest.fn()}
        />
      ), { wrappers: { theme: true }});

      expect(await findByText(/No Bitbucket issues found/i)).toBeInTheDocument();
    });
  });
});
