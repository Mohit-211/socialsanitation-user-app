// Checks that match the API's own rules, so most mistakes are caught before a request is sent.

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 8 to 100 characters, at least 2 digits, no spaces, and not one of two banned examples. */
export function isValidPassword(value: string): boolean {
  return (
    value.length >= 8 &&
    value.length <= 100 &&
    (value.match(/\d/g) ?? []).length >= 2 &&
    !/\s/.test(value) &&
    value !== 'Passw0rd' &&
    value !== 'Password123'
  );
}

export const PASSWORD_HINT =
  'At least 8 characters, with 2 numbers and no spaces.';

const POSTAL_CODES: Record<string, { pattern: RegExp; message: string }> = {
  US: {
    pattern: /^\d{5}(-\d{4})?$/,
    message: 'Enter a ZIP code like 33602 or 33602-1234',
  },
  CA: {
    pattern: /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/,
    message: 'Enter a postal code like M5V 2T6',
  },
};

/** An error message for a postal code in the given country (US or CA), or null when it is fine. */
export function postalCodeError(
  countryCode: string | undefined,
  value: string,
): string | null {
  const rule = countryCode ? POSTAL_CODES[countryCode] : undefined;
  return rule && !rule.pattern.test(value.trim()) ? rule.message : null;
}
