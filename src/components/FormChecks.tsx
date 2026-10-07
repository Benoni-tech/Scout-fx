"use client";

import { useState } from "react";
import { emailError, emailSuggestion, nameError, phoneError } from "@/lib/validation";

type Contact = { name: string; email: string; whatsapp: string };
type Key = keyof Contact;

/**
 * Instant checks for the name / email / WhatsApp fields. Errors appear once a field
 * has been left (or on submit), so people aren't told off while still typing.
 * The API runs the same rules, so this is only for feedback.
 */
export function useContactChecks(form: Contact) {
  const [shown, setShown] = useState<Partial<Record<Key, boolean>>>({});
  const errors: Record<Key, string> = {
    name: nameError(form.name),
    email: emailError(form.email),
    whatsapp: phoneError(form.whatsapp),
  };
  return {
    error: (k: Key) => (shown[k] ? errors[k] : ""),
    touch: (k: Key) => setShown((s) => ({ ...s, [k]: true })),
    /** Shows every error; true when the form is good to send. */
    checkAll: () => {
      setShown({ name: true, email: true, whatsapp: true });
      return !errors.name && !errors.email && !errors.whatsapp;
    },
    suggestion: emailSuggestion(form.email),
  };
}

/** Error under a field. For an email typo it offers the fix as a button. */
export function FieldError({
  message,
  suggestion,
  onUse,
}: {
  message: string;
  suggestion?: string;
  onUse?: (v: string) => void;
}) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs text-danger" role="alert">
      {suggestion && onUse ? (
        <>
          Did you mean{" "}
          <button type="button" onClick={() => onUse(suggestion)} className="font-semibold underline">
            {suggestion}
          </button>
          ?
        </>
      ) : (
        message
      )}
    </p>
  );
}

export const GHANA_NOTICE = "Open to Ghana-based participants. A Ghanaian WhatsApp number (+233) is required.";
