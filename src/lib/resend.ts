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
