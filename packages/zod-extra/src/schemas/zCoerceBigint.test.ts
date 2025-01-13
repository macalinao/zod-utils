import { describe, expect, test } from "vitest";

import { zCoerceBigint } from "./zCoerceBigint.js"; // Assuming this is the correct import path

describe("zCoerceBigint", () => {
  test("valid bigint strings", () => {
    expect(zCoerceBigint.parse("12345678901234567890")).toBe(
      BigInt("12345678901234567890"),
    );
    expect(zCoerceBigint.parse("0")).toBe(BigInt("0"));
  });

  test("invalid bigint strings", () => {
    expect(() => zCoerceBigint.parse("not-a-number")).toThrow();
    expect(() => zCoerceBigint.parse("123.456")).toThrow(); // Assuming decimals are not allowed
  });

  test("null or empty strings", () => {
    expect(zCoerceBigint.parse("")).toEqual(0n);
    expect(() => zCoerceBigint.parse(null)).toThrowError(
      /Expected bigint, received null/,
    );
  });
});
