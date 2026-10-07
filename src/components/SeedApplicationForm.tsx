"use client";

import { useCallback, useState, FormEvent, ReactNode } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
  User,
} from "lucide-react";
import TermsModal from "@/components/TermsModal";
import Honeypot, { honeypotValue } from "@/components/Honeypot";
import { FieldError, GHANA_NOTICE, useContactChecks } from "@/components/FormChecks";
import { EDUCATION_LEVELS, SEED_PROGRAM, TERMS_VERSION, YES_NO_UNSURE, seedTerms } from "@/lib/seedProgram";

const EXPERIENCE = [
  { value: "none", label: "Never traded" },
  { value: "beginner", label: "Tried a little" },
  { value: "some", label: "Trade sometimes" },
];

const inputCls =
  "w-full rounded-2xl border border-white/10 py-4 pl-11 pr-4 text-base text-white outline-none transition-all placeholder:text-zinc-600 focus:border-brand-500 focus:bg-white/[0.05] focus:ring-4 focus:ring-brand-500/10 [color-scheme:dark]";

function Field({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-zinc-400">{label}</span>
      {children}
    </label>
  );
}

function IconInput({ icon: Icon, children }: { icon: typeof User; children: ReactNode }) {
  return (
    <span className="group relative block">
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-brand-500" />
      {children}
    </span>
  );
}

function Choice({
  name,
  options,
  value,
  onChange,
  inline = false,
}: {
  inline?: boolean;
  name: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className={`grid gap-2 ${inline ? "grid-cols-3" : "sm:grid-cols-3"}`} role="radiogroup">
      {options.map((o) => {
        const on = value === o.value;
        return (
          <label
            key={o.value}
            className={`flex cursor-pointer items-center justify-center rounded-2xl border px-4 py-4 text-sm font-semibold transition-all ${
              on
                ? "border-brand-500 bg-brand-500 text-black"
                : "border-white/10 text-zinc-300 hover:border-white/25 hover:text-white"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={on}
              onChange={() => onChange(o.value)}
              className="sr-only"
              required
            />
            {o.label}
          </label>
        );
      })}
    </div>
  );
}

export default function SeedApplicationForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    dob: "",
    location: "",
    education: "",
    experience: "",
    hasHfmAccount: "",
    hasBinanceAccount: "",
    hasMt5Account: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<{ ref?: string; alreadyApplied?: boolean }>({});

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const checks = useContactChecks(form);
  const closeTerms = useCallback(() => setTermsOpen(false), []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const company = honeypotValue(e);
    e.preventDefault();
    if (!checks.checkAll()) {
      setStatus("error");
      setErrorMsg("Check the highlighted fields above.");
      return;
    }
    if (!agreed) {
      setStatus("error");
      setErrorMsg("Please read and accept the Terms & Conditions.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, termsAccepted: true, termsVersion: TERMS_VERSION, company }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Something went wrong");
      setResult(data);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="flex animate-fade-up flex-col items-center py-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-black shadow-glow">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h3 className="mt-6 text-2xl font-bold text-white">
          {result.alreadyApplied ? "You're already registered." : "You're registered."}
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
          {result.alreadyApplied
            ? "We already have your registration on file. We'll be in touch by email or WhatsApp."
            : `Thanks, ${form.name.split(" ")[0]}. Your place in the training is confirmed. We've emailed you a confirmation and will send the schedule soon.`}
        </p>
        {result.ref && (
          <p className="mt-6 rounded-full border border-white/10 px-5 py-2 text-sm text-zinc-400">
            Reference <span className="ml-2 font-mono font-bold tracking-[0.2em] text-brand-500">{result.ref}</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        <Honeypot />
        {/* about you */}
        <fieldset className="grid gap-4 md:grid-cols-2">
          <legend className="mb-4 text-sm font-bold text-white">
            <span className="mr-2 text-brand-500">01</span>About you
          </legend>
          <Field label="Full name">
            <IconInput icon={User}>
              <input required autoComplete="name" placeholder="First and last name" value={form.name} onChange={(e) => set("name")(e.target.value)} onBlur={() => checks.touch("name")} className={inputCls} />
            </IconInput>
            <FieldError message={checks.error("name")} />
          </Field>
          <Field label="Email">
            <IconInput icon={Mail}>
              <input required type="email" autoComplete="email" placeholder="you@email.com" value={form.email} onChange={(e) => set("email")(e.target.value)} onBlur={() => checks.touch("email")} className={inputCls} />
            </IconInput>
            <FieldError message={checks.error("email")} suggestion={checks.suggestion} onUse={set("email")} />
          </Field>
          <Field label="WhatsApp number">
            <IconInput icon={Phone}>
              <input required type="tel" autoComplete="tel" placeholder="024 123 4567" value={form.whatsapp} onChange={(e) => set("whatsapp")(e.target.value)} onBlur={() => checks.touch("whatsapp")} className={inputCls} />
            </IconInput>
            <FieldError message={checks.error("whatsapp")} />
            <p className="mt-1.5 text-xs text-zinc-500">{GHANA_NOTICE}</p>
          </Field>
          <Field label="Date of birth">
            <IconInput icon={CalendarDays}>
              <input required type="date" autoComplete="bday" value={form.dob} onChange={(e) => set("dob")(e.target.value)} className={inputCls} />
            </IconInput>
          </Field>
          <Field label="City & country">
            <IconInput icon={MapPin}>
              <input required autoComplete="address-level2" placeholder="e.g. Accra, Ghana" value={form.location} onChange={(e) => set("location")(e.target.value)} className={inputCls} />
            </IconInput>
          </Field>
          <Field label="Highest education">
            <IconInput icon={GraduationCap}>
              <select
                required
                value={form.education}
                onChange={(e) => set("education")(e.target.value)}
                className={`${inputCls} appearance-none pr-10 ${form.education ? "" : "text-zinc-600"}`}
              >
                <option value="" disabled>
                  Select your level
                </option>
                {EDUCATION_LEVELS.map((l) => (
                  <option key={l.value} value={l.value} className="bg-zinc-900 text-white">
                    {l.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            </IconInput>
          </Field>
        </fieldset>

        {/* experience */}
        <div className="border-t border-white/10 pt-8">
        <fieldset className="space-y-4">
          <legend className="mb-4 text-sm font-bold text-white">
            <span className="mr-2 text-brand-500">02</span>Your experience
          </legend>
          <Field label="Trading experience">
            <Choice name="experience" options={EXPERIENCE} value={form.experience} onChange={set("experience")} />
          </Field>
          <Field label="Do you already have an HFM account?">
            <Choice inline name="hasHfmAccount" options={YES_NO_UNSURE} value={form.hasHfmAccount} onChange={set("hasHfmAccount")} />
          </Field>
          <Field label="Do you have a Binance account?">
            <Choice inline name="hasBinanceAccount" options={YES_NO_UNSURE} value={form.hasBinanceAccount} onChange={set("hasBinanceAccount")} />
          </Field>
          <Field label="Do you have an MT5 (MetaTrader 5) account?">
            <Choice inline name="hasMt5Account" options={YES_NO_UNSURE} value={form.hasMt5Account} onChange={set("hasMt5Account")} />
          </Field>
        </fieldset>
        </div>

        {/* terms */}
        <div className="border-t border-white/10 pt-8">
          <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/20">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="peer sr-only"
              required
            />
            <span
              aria-hidden
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all peer-focus-visible:ring-4 peer-focus-visible:ring-brand-500/30 ${
                agreed ? "border-brand-500 bg-brand-500 text-black" : "border-white/25"
              }`}
            >
              {agreed && <Check className="h-4 w-4" strokeWidth={3} />}
            </span>
            <span className="text-sm leading-relaxed text-zinc-300">
              I have read and agree to the{" "}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setTermsOpen(true);
                }}
                className="font-semibold text-brand-500 underline underline-offset-4 hover:text-brand-400"
              >
                Terms &amp; Conditions
              </button>{" "}
              of the {SEED_PROGRAM.name}. I understand that registration guarantees training only, that seed capital is awarded at Scout FX&apos;s discretion and is not guaranteed, and that trading carries risk.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={status === "loading" || !agreed}
          className="group flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-4 text-base font-bold text-black transition-all hover:bg-brand-700 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:shadow-none"
        >
          {status === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          Complete registration
          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>
        {status === "error" && <p className="text-center text-sm text-danger">{errorMsg}</p>}
      </form>

      <TermsModal
        open={termsOpen}
        title={SEED_PROGRAM.name}
        version={TERMS_VERSION}
        sections={seedTerms}
        onClose={closeTerms}
        onAccept={() => {
          setAgreed(true);
          setTermsOpen(false);
        }}
      />
    </>
  );
}
