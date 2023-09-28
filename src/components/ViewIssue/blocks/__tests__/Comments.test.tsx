import { cleanup } from "@testing-library/react";
import { render, mockIssueComments } from "../../../../../testing";
import { filterIssueComments } from "../../../../utils";
import { Comments } from "../Comments";

jest.mock('react-time-ago', () => jest.fn().mockReturnValue('7h 30m'));

describe("ViewIssue", () => {
  describe("Details", () => {
    afterEach(() => {
      jest.clearAllMocks();
      cleanup();
    });

    test("render", async () => {
      const { findByText } = render((
        <Comments
          comments={filterIssueComments(mockIssueComments.values as never)}
          onNavigateToAddComment={jest.fn()}
        />
      ), { wrappers: { theme: true }});

      expect(await findByText(/Comments \(4\)/i)).toBeInTheDocument();
      expect(await findByText(/Lina Kostenko/i)).toBeInTheDocument();
      expect(await findByText(/Lesya Ukrainka/i)).toBeInTheDocument();
      expect(await findByText(/Ivan Franko/i)).toBeInTheDocument();
      expect(await findByText(/Taras Shevchenko/i)).toBeInTheDocument();
    });
  });
});
