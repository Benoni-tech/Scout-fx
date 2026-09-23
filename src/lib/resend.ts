import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

// Update these once the domain is verified in Resend
export const FROM_EMAIL = "Scout Cartel <hello@scoutcartel.trade>";
export const REPLY_TO_EMAIL = "hello@scoutcartel.trade";
