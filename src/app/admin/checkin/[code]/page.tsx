"use client";

import { use } from "react";
import { Container } from "@/components/ui";
import CheckinView from "@/components/admin/CheckinView";
import CodeEntry from "@/components/admin/CodeEntry";

export default function CheckinCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const normalized = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");

  return (
    <section className="py-10">
      <Container className="max-w-md">
        <CheckinView key={normalized} code={normalized} />
        <p className="mt-8 text-center text-sm text-ink-500">
          Next guest: scan their QR with your phone camera, or type the code.
        </p>
        <div className="mt-3">
          <CodeEntry />
        </div>
      </Container>
    </section>
  );
}
