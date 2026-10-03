import { Container } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Terms of use",
  description: "The terms for using the Scout FX website.",
  path: "/legal/terms",
});

export default function TermsPage() {
  return (
    <section className="py-16">
      <Container className="max-w-2xl">
        <h1 className="text-3xl font-bold leading-[1.05] tracking-tight text-gradient animate-fade-up pb-1">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: August 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-zinc-300">
          <p>
            By using this site you agree to these terms. If you do not
            agree, please do not use the site.
          </p>
          <p>
            <strong className="text-white">Use of content.</strong>{" "}
            Educational content, event information and signal history are
            provided for personal, non-commercial use. Do not redistribute
            or resell content from this site without permission.
          </p>
          <p>
            <strong className="text-white">No advice relationship.</strong>{" "}
            Using this site, joining the community, attending an event, or
            receiving a signal does not create an advisory, fiduciary or
            client relationship of any kind.
          </p>
          <p>
            <strong className="text-white">Third-party links.</strong>{" "}
            This site links to third-party services, including HFM. We are
            not responsible for the content, terms or practices of
            third-party sites.
          </p>
          <p>
            <strong className="text-white">Changes.</strong> These terms
            and the risk disclosure may be updated from time to time.
            Continued use of the site after changes means you accept the
            updated terms.
          </p>
          <p>
            Questions can be sent to hello@scoutsfx.com.
          </p>
        </div>
      </Container>
    </section>
  );
}
