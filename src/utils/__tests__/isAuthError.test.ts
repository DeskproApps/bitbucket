import { isAuthError } from "../isPayload";

describe("isPayload", () => {
  describe("isAuthError", () => {
    test("should auth error payload", () => {
      expect(isAuthError({ error: "invalid_grant", error_description: "" }))
        .toBeTruthy();
    });

    test("shouldn't auth error payload", () => {
      expect(isAuthError({
        type: "error",
        error: {
          message: "error message",
          detail: "There is no API hosted at this URL."
        }
      })).toBeFalsy()
    });

    test.each([undefined, null, "", 0, true, false, {}])("wrong value: %p", (payload) => {
      expect(isAuthError(payload as never)).toBeFalsy();
    });
  });
});
