import { describe, expect, test } from "bun:test";
import { zPrefixedString } from "./zPrefixedString.js";

describe("zPrefixedString", () => {
  test("zPrefixedString with valid prefixed strings", () => {
    const schema = zPrefixedString("prefix");

    expect(schema.parse("prefix_validString")).toBe("prefix_validString");
    expect(schema.parse("prefix_anotherString")).toBe("prefix_anotherString");
  });

  test("zPrefixedString with invalid prefixed strings", () => {
    const schema = zPrefixedString("prefix");

    expect(() => schema.parse("invalidString")).toThrow();
    expect(() => schema.parse("prefix_")).toThrow();
    expect(() => schema.parse("prefix")).toThrow();
  });

  test("zPrefixedString with custom label", () => {
    const schema = zPrefixedString("prefix", "customLabel");

    expect(
      schema.safeParse("invalidString").error?.flatten().formErrors,
    ).toEqual(['CustomLabel must start with the prefix "prefix_".']);
  });
});
