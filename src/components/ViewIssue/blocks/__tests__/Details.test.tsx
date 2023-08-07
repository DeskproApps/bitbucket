import { cleanup } from "@testing-library/react";
import { render, mockIssues } from "../../../../../testing";
import { Details } from "../Details";

jest.mock("../../../common/DeskproTickets/DeskproTickets", () => ({
  DeskproTickets: () => <>100500</>,
}));

describe("ViewIssue", () => {
  describe("Details", () => {
    afterEach(() => {
      jest.clearAllMocks();
      cleanup();
    });

    test("render", async () => {
      const { findByText, findAllByText } = render((
        <Details issue={mockIssues.values[0] as never} />
      ), { wrappers: { theme: true }});

      expect(await findByText(/Classic issue in the Public repo/i)).toBeInTheDocument();
      expect(await findByText(/This is description/i)).toBeInTheDocument();
      expect(await findByText(/on hold/i)).toBeInTheDocument();
      expect(await findByText(/26 Jul, 2023/i)).toBeInTheDocument();
      expect(await findByText(/#1/i)).toBeInTheDocument();
      expect(await findByText(/My-own workspace/i)).toBeInTheDocument();
      expect(await findByText(/Deskpro Public Project/i)).toBeInTheDocument();
      expect(await findByText(/apps-lab/i)).toBeInTheDocument();
      expect(await findByText(/bug/i)).toBeInTheDocument();
      expect(await findByText(/minor/i)).toBeInTheDocument();
      expect(await findByText(/DP Chore/i)).toBeInTheDocument();
      expect(await findByText(/100500/i)).toBeInTheDocument();
      expect(await findAllByText(/Ilya Makarov/i)).toHaveLength(2);
    });
  });
});
