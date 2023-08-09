import { cleanup } from "@testing-library/react";
import { render, mockComments } from "../../../../../testing";
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
          comments={mockComments.values as never}
          onNavigateToAddComment={jest.fn()}
        />
      ), { wrappers: { theme: true }});

      expect(await findByText(/Comments \(2\)/i)).toBeInTheDocument();
      expect(await findByText(/hey ho, let’s go!!!/i)).toBeInTheDocument();
      expect(await findByText(/Duplicate of #4/i)).toBeInTheDocument();
    });
  });
});
