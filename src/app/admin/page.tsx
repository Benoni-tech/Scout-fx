"use client";

import { useEffect, useState } from "react";
import { Users, CalendarCheck, ScanLine, Mail, ArrowRight } from "lucide-react";
import { Container, StatCard } from "@/components/ui";
import { useAdmin } from "@/components/admin/AdminGate";

type Stats = {
  leads: number;
  subscribers: number;
  rsvps: number;
  checkedIn: number;
};

export default function AdminOverviewPage() {
  const { authFetch } = useAdmin();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    authFetch("/api/admin/stats")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Couldn't load stats.");
        setStats(data);
      })
      .catch((e) => setError(e.message));
  }, [authFetch]);

  const v = (n?: number) => (stats ? n!.toLocaleString() : "…");

  return (
    <section className="py-12">
      <Container>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">
          Admin overview
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          Live counts from Firestore.
        </p>
        {error && <p className="mt-4 text-sm text-danger">{error}</p>}

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={<CalendarCheck className="h-4 w-4 text-ink-900" />} iconBg="bg-brand-600" label="Event registrations" value={v(stats?.rsvps)} />
          <StatCard icon={<ScanLine className="h-4 w-4 text-ink-900" />} iconBg="bg-brand-600" label="Checked in" value={v(stats?.checkedIn)} />
          <StatCard icon={<Users className="h-4 w-4 text-ink-900" />} iconBg="bg-brand-600" label="Community leads" value={v(stats?.leads)} />
          <StatCard icon={<Mail className="h-4 w-4 text-ink-900" />} iconBg="bg-brand-600" label="Newsletter subscribers" value={v(stats?.subscribers)} />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <a
            href="/admin/events"
            className="flex items-center justify-between rounded-2xl border border-ink-100 bg-white p-5 transition-shadow hover:shadow-card"
          >
            <div>
              <p className="text-sm font-bold text-ink-900">Event registrations</p>
              <p className="text-sm text-ink-500">See who signed up, export to CSV.</p>
            </div>
            <ArrowRight className="h-4 w-4 text-ink-900" />
          </a>
          <a
            href="/admin/checkin"
            className="flex items-center justify-between rounded-2xl border border-ink-100 bg-white p-5 transition-shadow hover:shadow-card"
          >
            <div>
              <p className="text-sm font-bold text-ink-900">Gate check-in</p>
              <p className="text-sm text-ink-500">Scan a ticket QR or type the code.</p>
            </div>
            <ArrowRight className="h-4 w-4 text-ink-900" />
          </a>
        </div>
      </Container>
    </section>
  );
}
