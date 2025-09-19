import type {
  CountryCode,
  E164Number as LPE164Number,
} from "libphonenumber-js";
import { ParseError, parsePhoneNumberWithError } from "libphonenumber-js";
import * as z from "zod";

export type { CountryCode };
export type E164Number = LPE164Number;

export type ZodPhoneNumber = z.ZodType<E164Number, string>;

export type ParsePhoneNumberOptions = Parameters<
  typeof parsePhoneNumberWithError
>[1];

/**
 * Generates a Zod schema that validates and formats a phone number to E164 using `libphonenumber-js`.
 * Attempts to parse the provided value with an optional default country.
 *
 * If the phone number is valid, the schema transforms the phone number into
 * an international format (e.g. `+358401234567`).
 */
export const zPhoneNumber = (
  defaultCountry: ParsePhoneNumberOptions = undefined,
): ZodPhoneNumber =>
  z
    .string()
    .min(1, "This is a required field.")
    .transform<E164Number>((value, ctx) => {
      try {
        const phoneNumber = parsePhoneNumberWithError(value, defaultCountry);
        if (!phoneNumber.isValid()) {
          ctx.addIssue({
            code: "custom",
            message: "Please verify that your phone number is correct.",
          });
          return z.NEVER;
        }
        return phoneNumber.number;
      } catch (error: unknown) {
        if (error instanceof ParseError) {
          ctx.addIssue({
            code: "custom",
            message:
              error.message === "TOO_SHORT"
                ? "Please verify that your phone number is correct."
                : error.message,
          });
          return z.NEVER;
        }
        throw error;
      }
    });
