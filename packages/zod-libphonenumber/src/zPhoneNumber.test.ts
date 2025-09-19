/// <reference types="bun-types" />

import type { E164Number } from "./zPhoneNumber.js"; // Assuming this is the correct import path
import { describe, expect, test } from "bun:test";
import { zPhoneNumber } from "./zPhoneNumber.js"; // Assuming this is the correct import path

describe("zPhoneNumber", () => {
  test("valid phone numbers", () => {
    const schema = zPhoneNumber("US");
    expect(schema.parse("+19082839281")).toBe("+19082839281" as E164Number);
    expect(schema.parse("908-283-9281")).toBe("+19082839281" as E164Number);
    expect(schema.parse("+6309288372827")).toBe("+639288372827" as E164Number);
  });

  test("invalid phone numbers", () => {
    const schema = zPhoneNumber();
    expect(() => schema.parse("not-a-phone-number")).toThrow();
    expect(() => schema.parse("123")).toThrow();
  });
});
