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
        <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-gradient animate-fade-up pb-1 sm:text-5xl">
          Get in touch
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-zinc-400">
          Questions about the community, an event, or a partnership? Reach
          out through any of the channels below. General trading questions
          are best asked inside the community.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {channels.map((c) => (
            <a
              key={c.title}
              href={c.href}
              className="flex items-start gap-4 card p-5 card-hover"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10">
                <c.icon className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{c.title}</p>
                <p className="mt-0.5 text-sm text-zinc-400">{c.detail}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start gap-4 rounded-3xl border border-white/10 bg-brand-500/10 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">
              Looking for partnerships or press?
            </p>
            <p className="mt-1 text-sm text-zinc-400">
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
