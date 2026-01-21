import { loadStripe, Stripe } from "@stripe/stripe-js";

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

let stripePromise: Promise<Stripe | null> | null = null;

export function getStripe(): Promise<Stripe | null> {
  if (!stripePublishableKey) {
    console.warn(
      "Stripe publishable key not found. Payments will not work. " +
      "Please set VITE_STRIPE_PUBLISHABLE_KEY in your .env.local file."
    );
    return Promise.resolve(null);
  }

  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey);
  }

  return stripePromise;
}

// Platform configuration
export const PLATFORM_FEE_PERCENT = 15;
export const TEACHER_SHARE_PERCENT = 85;
export const MINIMUM_PAYOUT_CENTS = 5000; // $50 minimum payout
export const ESCROW_HOLD_HOURS = 24;
export const DEFAULT_CURRENCY = "usd";

// Helper functions
export function calculatePlatformFee(amountCents: number): number {
  return Math.round(amountCents * (PLATFORM_FEE_PERCENT / 100));
}

export function calculateTeacherAmount(amountCents: number): number {
  return amountCents - calculatePlatformFee(amountCents);
}

export function formatCurrency(amountCents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountCents / 100);
}

export function centsToUSD(cents: number): number {
  return cents / 100;
}

export function usdToCents(usd: number): number {
  return Math.round(usd * 100);
}
