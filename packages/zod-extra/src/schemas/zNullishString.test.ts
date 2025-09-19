import { expect, test } from "bun:test";
import { zNonEmptyString } from "./zNonEmptyString.js";
import { zNullishString } from "./zNullishString.js";

test("nullable strings", () => {
  const schema = zNullishString(zNonEmptyString.max(80));
  expect(schema.parse("")).toBeNull();
  expect(schema.parse("    ")).toBeNull();
  expect(schema.safeParse("")).toEqual({ success: true, data: null });
  expect(schema.safeParse(null)).toEqual({ success: true, data: null });
  expect(schema.safeParse(" this is my string ")).toEqual({
    success: true,
    data: "this is my string",
  });
});
