import { z } from "zod";

export const zNonEmptyString: z.ZodString = z
  .string()
  .trim()
  .min(1, "Required");
