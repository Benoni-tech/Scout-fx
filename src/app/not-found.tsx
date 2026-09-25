import { Container, PrimaryButton, SecondaryButton } from "@/components/ui";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <section className="py-24">
      <Container className="max-w-lg text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10">
          <Compass className="h-5 w-5 text-white" />
        </div>
        <h1 className="mt-5 text-3xl font-bold leading-[1.05] tracking-tight text-gradient animate-fade-up pb-1">
          Page not found
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          The page you&apos;re looking for doesn&apos;t exist or may have
          moved.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <PrimaryButton href="/">Back to home</PrimaryButton>
          <SecondaryButton href="/education">
            Browse education library
          </SecondaryButton>
        </div>
      </Container>
    </section>
  );
}
