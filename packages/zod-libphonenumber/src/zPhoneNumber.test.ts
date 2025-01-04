import { describe, expect, test } from "vitest";

import { zPhoneNumber } from "./zPhoneNumber.js"; // Assuming this is the correct import path

describe("zPhoneNumber", () => {
  test("valid phone numbers", () => {
    const schema = zPhoneNumber("US");
    expect(schema.parse("+19082839281")).toBe("+19082839281");
    expect(schema.parse("908-283-9281")).toBe("+19082839281");
    expect(schema.parse("+6309288372827")).toBe("+639288372827");
  });

  test("invalid phone numbers", () => {
    const schema = zPhoneNumber();
    expect(() => schema.parse("not-a-phone-number")).toThrow();
    expect(() => schema.parse("123")).toThrow();
  });
});
