import { isAPIError } from "../isPayload";

describe("isPayload", () => {
  describe("isAuthError", () => {
    test("should api error payload", () => {
      expect(isAPIError({
        type: "error",
        error: {
          code: 100500,
          message: "error message",
          detail: "There is no API hosted at this URL."
        }
      })).toBeTruthy()
    });

    test("shouldn't api error payload", () => {
      expect(isAPIError({ error: "invalid_grant", error_description: "" }))
        .toBeFalsy();
    });

    test.each([undefined, null, "", 0, true, false, {}])("wrong value: %p", (payload) => {
      expect(isAPIError(payload as never)).toBeFalsy();
    });
  });
});
