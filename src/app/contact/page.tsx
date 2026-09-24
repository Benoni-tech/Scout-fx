import { Container, Eyebrow, PrimaryButton, SecondaryButton } from "@/components/ui";
import { Mail, MessageCircle, Twitter, Linkedin } from "lucide-react";

const channels = [
  {
    icon: Mail,
    title: "Email",
    detail: "hello@scoutsfx.com",
    href: "mailto:hello@scoutsfx.com",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp community",
    detail: "Join the group for quick questions",
    href: "#",
  },
  {
    icon: Twitter,
    title: "Twitter / X",
    detail: "@scoutcartel",
    href: "#",
  },
  {
    icon: Linkedin,
    title: "LinkedIn",
    detail: "Scout FX",
    href: "#",
  },
];

export default function ContactPage() {
  return (
    <section className="py-16">
      <Container className="max-w-3xl">
        <Eyebrow>Contact</Eyebrow>
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
          Get in touch
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-500">
          Questions about the community, an event, or a partnership? Reach
          out through any of the channels below. General trading questions
          are best asked inside the community.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {channels.map((c) => (
            <a
              key={c.title}
              href={c.href}
              className="flex items-start gap-4 rounded-2xl border border-ink-100 bg-white p-5 transition-shadow hover:shadow-card"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                <c.icon className="h-4 w-4 text-ink-900" />
              </div>
              <div>
                <p className="text-sm font-bold text-ink-900">{c.title}</p>
                <p className="mt-0.5 text-sm text-ink-500">{c.detail}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start gap-4 rounded-3xl border border-ink-100 bg-brand-50/60 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-ink-900">
              Looking for partnerships or press?
            </p>
            <p className="mt-1 text-sm text-ink-500">
              Check the partnerships page or grab the media kit first.
            </p>
          </div>
          <div className="flex gap-2">
            <SecondaryButton href="/media-kit">Media kit</SecondaryButton>
            <PrimaryButton href="/partnerships">Partnerships</PrimaryButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
