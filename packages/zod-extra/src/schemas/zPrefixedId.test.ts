import { describe, expect, it } from "bun:test";
import { makeIDSchemas } from "./zPrefixedId.js";

describe("zPrefixedId", () => {
  it("zPrefixedId with valid prefixed strings", () => {
    const mapping = {
      accounts: "acc",
      users: "usr",
      posts: "pst",
    } as const;
    const zId = makeIDSchemas(mapping);
    expect(() => zId.accounts.parse("acc_123")).not.toThrow();
    expect(() => zId.users.parse("usr_123")).not.toThrow();
    expect(() => zId.posts.parse("pst_123")).not.toThrow();

    expect(() => zId.users.parse("acc_123")).toThrow();
    expect(() => zId.users.parse("pst_123")).toThrow();
    expect(() => zId.posts.parse("usr_123")).toThrow();
  });
});
