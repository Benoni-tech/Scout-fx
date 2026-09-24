import { ScanLine } from "lucide-react";
import { Container } from "@/components/ui";
import CodeEntry from "@/components/admin/CodeEntry";

export default function CheckinPage() {
  return (
    <section className="py-12">
      <Container className="max-w-md text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-600">
          <ScanLine className="h-5 w-5 text-ink-900" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-ink-900">Gate check-in</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          Point your phone camera at the guest&apos;s QR code and tap the link
          that appears. It opens their ticket here so you can admit them. Stay
          signed in on this phone.
        </p>
        <p className="mt-6 text-sm font-semibold text-ink-900">
          QR won&apos;t scan? Type the code under it:
        </p>
        <div className="mt-3">
          <CodeEntry />
        </div>
      </Container>
    </section>
  );
}
