import { z } from "zod";

export const zCoerceNumber: z.ZodType<string | null, z.ZodTypeDef, string> = z
  .string()
  .transform((s) => {
    if (!s) {
      return null;
    }
    const result = parseFloat(s.split(",").join(""));
    if (Number.isNaN(result)) {
      return null;
    }
    return result.toString();
  });

export const zCoerceNumberValid: z.ZodType<string, z.ZodTypeDef, string> =
  zCoerceNumber.refine((v): v is string => v !== null, {
    message: "Invalid number",
  });
