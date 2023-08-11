import { retryUntilHavePagination } from "../retryUntilHavePagination";
import { mockClient } from "../../../testing";

describe("retryUntilHavePagination", () => {
    test("args", async () => {
        const mockCallback = jest.fn(() => Promise.resolve({ values: ["one"] }))
        const mockCallbackWithRetries = retryUntilHavePagination(mockCallback as never)
        await mockCallbackWithRetries(mockClient as never, {}).then((res) =>
            expect(res).toEqual({ values: ["one"] }),
        );

        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenNthCalledWith(1, mockClient, { page: 1 });
    });

    test("should retying", async () => {
        const mockCallback = jest.fn()
            .mockResolvedValueOnce({ pagelen: 1, size: 3, page: 1, values: ["one"] })
            .mockResolvedValueOnce({ pagelen: 1, size: 3, page: 2, values: ["two"] })
            .mockResolvedValueOnce({ pagelen: 1, size: 3, page: 3, values: ["three"] });
        const mockCallbackWithRetries = retryUntilHavePagination(mockCallback as never);

        await mockCallbackWithRetries(mockCallback as never, {}).then((res) => {
            expect(res).toEqual({ values: ["one", "two", "three"] });
        });

        expect(mockCallback).toHaveBeenCalledTimes(3);
    });
});
