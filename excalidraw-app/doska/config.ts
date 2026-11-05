// Doska product settings. Change these to match your business.

export const DOSKA_NAME = "Doska";

/** Boards a user may keep on the free plan. Creating one more asks for Pro. */
export const FREE_BOARD_LIMIT = 1;

/**
 * Price shown in the Pro dialog. Display only: the real price is whatever
 * your payment page charges.
 */
export const PRO_PRICE = {
  "uz-UZ": "49 000 soʻm / oy",
  "uz-Cyrl-UZ": "49 000 сўм / ой",
  en: "49,000 UZS / month",
} as const;

/**
 * Where the "Pro'ga o'tish" button sends people (your Payme / Click / Uzum
 * checkout, or a Telegram bot). Set VITE_APP_DOSKA_PRO_CHECKOUT_URL in
 * .env.production. When empty, the button is shown as "coming soon".
 */
export const PRO_CHECKOUT_URL: string =
  import.meta.env.VITE_APP_DOSKA_PRO_CHECKOUT_URL || "";
