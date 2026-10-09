import { Resend } from "resend";

// Created on first use: the constructor throws without a key, which would
// otherwise break every route that imports this file.
let client: Resend | undefined;
export function getResend() {
  return (client ??= new Resend(process.env.RESEND_API_KEY));
}

// Update these once the domain is verified in Resend
export const FROM_EMAIL = "Scout FX <hello@scoutsfx.com>";
export const REPLY_TO_EMAIL = "hello@scoutsfx.com";

/** A send Resend refused (quota, invalid address, outage...). `code` is Resend's error name. */
export class EmailError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.name = "EmailError";
    this.code = code;
  }
}

/**
 * Sends one email and throws if Resend refused it. The SDK reports failures
 * (e.g. the free plan's daily limit) in its return value instead of throwing,
 * so calling it directly would treat a failed send as delivered.
 */
export async function sendEmail(payload: Parameters<Resend["emails"]["send"]>[0]) {
  const { data, error } = await getResend().emails.send(payload);
  if (error || !data) throw new EmailError(error?.message ?? "No response from Resend", error?.name ?? "unknown");
  return data.id;
}

/** Daily/monthly plan limit or too many requests: retrying now won't help. */
export function isQuotaError(err: unknown) {
  return err instanceof EmailError && /quota|rate_limit/i.test(err.code);
}
