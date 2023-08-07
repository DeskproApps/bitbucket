import { cleanup } from "@testing-library/react";
import { render, mockIssues } from "../../../../testing";
import { IssueItem } from "../IssueItem";

jest.mock("../../common/DeskproTickets/DeskproTickets", () => ({
  DeskproTickets: () => <>100500</>,
}));

describe("IssueItem", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("render", async () => {
    const { findByText } = render((
      <IssueItem issue={mockIssues.values[0] as never} onClickTitle={jest.fn()} />
    ), { wrappers: { theme: true } });

    expect(await findByText(/on hold/i)).toBeInTheDocument();
    expect(await findByText(/26 Jul, 2023/i)).toBeInTheDocument();
    expect(await findByText(/#1/i)).toBeInTheDocument();
    expect(await findByText(/My-own workspace/i)).toBeInTheDocument();
    expect(await findByText(/Deskpro Public Project/i)).toBeInTheDocument();
    expect(await findByText(/apps-lab/i)).toBeInTheDocument();
    expect(await findByText(/100500/i)).toBeInTheDocument();
    expect(await findByText(/Ilya Makarov/i)).toBeInTheDocument();
  });
});
