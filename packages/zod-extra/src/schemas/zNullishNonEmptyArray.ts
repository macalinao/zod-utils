import * as z from "zod";

export type NonEmptyArray<T> = [T, ...T[]];

/**
 * Transforms zero length arrays to null.
 * @param inner
 * @returns
 */
export const zRequiredNullishNonEmptyArray = <TValueSchema extends z.ZodType>(
  inner: TValueSchema,
): z.ZodType<
  NonEmptyArray<z.output<TValueSchema>> | null,
  z.input<TValueSchema>[]
> =>
  z.union([
    inner
      .array()
      .length(0)
      .transform(() => null),
    inner
      .array()
      .nonempty()
      .transform((v) => v as NonEmptyArray<z.output<TValueSchema>>),
  ]);

/**
 * Transforms zero length arrays to null, allowing for null input values.
 * @param inner
 * @returns
 */
export const zNullishNonEmptyArray = <TValueSchema extends z.ZodType>(
  inner: TValueSchema,
): z.ZodType<
  NonEmptyArray<z.output<TValueSchema>> | null,
  z.input<TValueSchema>[] | null
> => z.union([zRequiredNullishNonEmptyArray(inner), z.null()]);
