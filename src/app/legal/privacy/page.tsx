import type { Metadata } from "next";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy | Scout FX",
};

export default function PrivacyPage() {
  return (
    <section className="py-16">
      <Container className="max-w-2xl">
        <h1 className="text-3xl font-bold leading-[1.05] tracking-tight text-gradient animate-fade-up pb-1">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: October 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-300">
          <p>
            This policy explains what information Scout FX collects through
            scoutsfx.com, why, and the choices you have.
          </p>
          <p>
            <strong className="text-white">Information you give us.</strong>{" "}
            When you register for an event, join the community or register
            for the Seed Program, we collect the details you enter, such as
            your name, email address and WhatsApp number (and, for the Seed
            Program, the extra details on that form). We use them to run the
            event or program, send your ticket or confirmation, and contact
            you about it. We do not sell your information.
          </p>
          <p>
            <strong className="text-white">Meta Pixel on event pages.</strong>{" "}
            Our event pages use the Meta Pixel, a tool from Meta Platforms
            (Facebook and Instagram), to measure how well our ads work. When
            you visit an event page, the pixel may record that visit and,
            if you register, that a registration happened. Meta may use
            cookies (such as <code className="text-zinc-400">_fbp</code>) and
            information about your browser and device to do this, and to
            show relevant ads. We do not send your name, email or phone
            number to Meta. The Meta Pixel is not used on other pages of
            this site.
          </p>
          <p>
            <strong className="text-white">Your choices.</strong> You can
            control ads you see from Meta in your{" "}
            <a
              href="https://www.facebook.com/adpreferences"
              target="_blank"
              rel="noreferrer"
              className="text-brand-500 underline underline-offset-4"
            >
              Facebook ad preferences
            </a>
            , block or delete cookies in your browser settings, or use a
            browser or extension that blocks tracking. Blocking cookies does
            not stop you registering for an event.
          </p>
          <p>
            <strong className="text-white">Service providers.</strong> We
            use trusted providers to run this site: Vercel (hosting),
            Google Firebase (storing registrations) and Resend (sending
            emails). They process data on our behalf.
          </p>
          <p>
            <strong className="text-white">Access and deletion.</strong>{" "}
            You can ask us for a copy of the information we hold about you,
            or ask us to correct or delete it, by emailing
            hello@scoutsfx.com.
          </p>
          <p>
            <strong className="text-white">Changes.</strong> We may update
            this policy from time to time. The date at the top shows when
            it last changed.
          </p>
        </div>
      </Container>
    </section>
  );
}
