import type { ZodPhoneNumber } from "./zPhoneNumber.js";
import { zPhoneNumber } from "./zPhoneNumber.js";

/**
 * A Philippines phone number validator. Exported for convenience.
 */
export const zPhoneNumberPH: ZodPhoneNumber = zPhoneNumber("PH");
