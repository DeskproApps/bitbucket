import { format } from "../format";

describe("date", () => {
  describe("format", () => {
    test("should return empty date", () => {
      expect(format(null)).toEqual("-");
    });

    test("should return date if pass date as Date", () => {
      expect(format(new Date("2023-06-30T21:00:00.000Z")))
        .toEqual("30 Jun, 2023");
    });

    test("should return date if pass date as string", () => {
      expect(format("2023-06-30T21:00:00.000Z"))
        .toEqual("30 Jun, 2023");
    });
  });
});
