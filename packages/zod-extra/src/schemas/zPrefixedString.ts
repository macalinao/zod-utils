import { z } from "zod";

/**
 * A string that starts with a prefix and is followed by an underscore and a string.
 */
export type PrefixedString<TPrefix extends string> = `${TPrefix}_${string}`;

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Validates a prefixed string.
 * @param prefix
 * @returns
 */
export const zPrefixedString = <TPrefix extends string>(
  prefix: TPrefix,
  label = "string",
): z.ZodType<PrefixedString<TPrefix>> => {
  const caps = label.toUpperCase() === label ? label : capitalize(label);
  return z
    .string()
    .startsWith(
      `${prefix}_`,
      `${caps} must start with the prefix "${prefix}_".`,
    )
    .min(
      prefix.length + 2,
      `Malformed ${label === "string" ? "prefixed string" : label}`,
    )
    .and(z.custom<PrefixedString<TPrefix>>());
};

/**
 * Validates a prefixed string that is used as an ID.
 * @param prefix
 * @returns
 */
export const zPrefixedId = <TPrefix extends string>(
  prefix: TPrefix,
): z.ZodType<PrefixedString<TPrefix>> => {
  return zPrefixedString(prefix, "ID");
};
