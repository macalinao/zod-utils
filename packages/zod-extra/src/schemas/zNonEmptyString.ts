import { z } from "zod";

/**
 * A Zod schema that ensures the input is a non-empty string; that is, it contains characters that are not whitespace.
 */
export const zNonEmptyString: z.ZodString = z
  .string()
  .trim()
  .min(1, "Required");
