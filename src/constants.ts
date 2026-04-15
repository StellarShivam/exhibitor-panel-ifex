

export enum Currency {
  INR = "INR",
  USD = "USD",
  EUR = "EUR",
}

export const CURRENCY_SYMBOL: Record<Currency, string> = {
  [Currency.INR]: "₹",
  [Currency.USD]: "$",
  [Currency.EUR]: "€",
};

/** Maps non-standard API currency strings to valid ISO 4217 codes. */
export const CURRENCY_NORMALIZER: Record<string, Currency> = {
  EURO: Currency.EUR,
  EUROS: Currency.EUR,
  DOLLAR: Currency.USD,
  DOLLARS: Currency.USD,
  RUPEE: Currency.INR,
  RUPEES: Currency.INR,
};

/** Normalise any currency string (e.g. "EURO") to a valid ISO 4217 code (e.g. "EUR"). */
export function normalizeCurrency(raw: string): string {
  const upper = raw.toUpperCase();
  return CURRENCY_NORMALIZER[upper] ?? upper;
}
