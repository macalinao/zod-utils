import * as z from "zod";

/**
 * Coerces a bigint, number, or string to a bigint.
 *
 * This is especially useful for bigints returned from Kysely.
 */
export const zCoerceBigint: z.ZodType<bigint, bigint | number | string> =
  z.union([
    z.bigint(),
    z.number().transform((n) => BigInt(n)),
    z.coerce.bigint<string>(),
  ]);
