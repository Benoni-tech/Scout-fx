// WhatsApp invite links shown on the site. Only genuine invite/channel links are
// rendered, so a typo or a swapped link can never send people somewhere else.

const INVITE_RE = /^https:\/\/(chat\.whatsapp\.com\/[A-Za-z0-9]+|(www\.)?whatsapp\.com\/channel\/[A-Za-z0-9]+)$/;

export function safeWhatsAppInvite(url: string | undefined) {
  return url && INVITE_RE.test(url) ? url : "";
}

/**
 * The community WhatsApp group people join from the Join page. If the link leaks
 * or is reset in WhatsApp, paste the new one here.
 */
export const COMMUNITY_WHATSAPP_URL = safeWhatsAppInvite("https://chat.whatsapp.com/KH0EfhuKRTq9Sl0jD4Xs50");
