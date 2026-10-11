import { Container, Eyebrow } from "@/components/ui";
import LeadForm from "@/components/LeadForm";
import { CheckCircle2 } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import PagePixel from "@/components/PagePixel";
import { COMMUNITY_WHATSAPP_URL } from "@/lib/whatsapp";

const perks = [
  "Free lessons on technical analysis, risk and trading psychology",
  "First to know about seminars and workshops",
  "No spam, no pressure to trade, ever",
];

export const metadata = buildMetadata({
  title: "Join the community free",
  description: "Join the free Scout FX WhatsApp community: trading education, first word on seminars and workshops, and no pressure to trade.",
  path: "/join",
  image: "/join/opengraph-image",
});

export default function JoinPage() {
  return (
    <section className="bg-grid py-16">
      <PagePixel contentName="Scout FX community" contentType="community" />
      <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow>Free to join</Eyebrow>
          <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-gradient animate-fade-up pb-1 sm:text-5xl">
            Join the community
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-zinc-400">
            Our free WhatsApp group for education, event invites and
            updates, with no algorithm deciding what you see.
          </p>
          <ul className="mt-8 space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-zinc-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="card rounded-3xl p-8 shadow-card">
          <LeadForm source="join-page" whatsappUrl={COMMUNITY_WHATSAPP_URL} />
        </div>
      </Container>
    </section>
  );
}
