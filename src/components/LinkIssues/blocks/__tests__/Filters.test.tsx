import { cleanup, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render, mockRepositories } from "../../../../../testing";
import { Filters } from "../Filters";

describe("LinkIssues", () => {
  describe("Filters", () => {
    beforeEach(() => {
      Element.prototype.scrollTo = () => {};
    });
    afterEach(() => {
      jest.clearAllMocks();
      cleanup();
    });

    test("render", async () => {
      const { findByText } = render((
        <Filters
          repositories={[]}
          selectedRepository={""}
          onChangeRepository={jest.fn()}
        />
      ), { wrappers: { theme: true }});

      expect(await findByText(/Repository/i)).toBeInTheDocument();
    });

    test("should show no \"No repository(s) found\" if no repositories", async () => {
      const { findByText } = render((
        <Filters
          repositories={[]}
          selectedRepository={""}
          onChangeRepository={jest.fn()}
        />
      ), { wrappers: { appSdk: true }});

      const repositorySelect = await findByText(/Select Value/i);

      await act(async () => {
        await userEvent.click(repositorySelect as Element);
      });

      expect(await findByText(/No repository\(s\) found/i)).toBeInTheDocument();
    });

    test("should show repositories", async () => {
      const { findByText } = render((
        <Filters
          repositories={mockRepositories.values as never[]}
          selectedRepository={""}
          onChangeRepository={jest.fn()}
        />
      ), { wrappers: { appSdk: true }});

      const repositorySelect = await findByText(/Select Value/i);

      await act(async () => {
        await userEvent.click(repositorySelect as Element);
      });

      expect(await findByText(/apps-lab/i)).toBeInTheDocument();
    });
  });
});
