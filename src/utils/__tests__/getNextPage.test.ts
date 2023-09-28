import { getNextPage } from "../getNextPage";

const mockParams = {
    pagelen: 5,
    size: 26,
    page: 1,
    next: "https://some.repo?pagelen=5&page=2",
};

describe("getNextPage", () => {
    test("should return next page", () => {
        expect(getNextPage(mockParams as never)).toBe(2);
        expect(getNextPage({ ...mockParams, page: 2 } as never)).toBe(3);
    });

    test("should return undefined if run out of pages", () => {
        expect(getNextPage({ ...mockParams, page: 6 } as never)).toBeUndefined();
    });

    test("should return undefined if already return full items", () => {
        expect(getNextPage({ ...mockParams, pagelen: 100 } as never)).toBeUndefined();
    });

    test("should return undefined if no pagination params", () => {
        expect(getNextPage()).toBeUndefined();
    });

    test.each([undefined, null, "", 0, true, false, {}])("wrong value: %p", (value) => {
        expect(getNextPage(value as never)).toBeUndefined();
    });
});
