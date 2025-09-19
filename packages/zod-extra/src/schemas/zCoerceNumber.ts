import { z } from "zod";

/**
 * A Zod schema that coerces strings to numbers, allowing for null input values.
 */
export const zCoerceNumber: z.ZodType<string | null, string> = z
  .string()
  .transform((s) => {
    if (!s) {
      return null;
    }
    const result = Number.parseFloat(s.split(",").join(""));
    if (Number.isNaN(result)) {
      return null;
    }
    return result.toString();
  });

/**
 * A Zod schema that ensures the output is a valid number.
 */
export const zCoerceNumberValid: z.ZodType<string | null, string> =
  zCoerceNumber.refine((v): v is string => v !== null, {
    message: "Invalid number",
  });
