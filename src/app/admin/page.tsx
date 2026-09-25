"use client";

import { useEffect, useState } from "react";
import { Users, CalendarCheck, ScanLine, ArrowRight } from "lucide-react";
import { Container, StatCard } from "@/components/ui";
import { useAdmin } from "@/components/admin/AdminGate";

type Stats = {
  leads: number;
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
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Admin overview
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Live counts from Firestore.
        </p>
        {error && <p className="mt-4 text-sm text-danger">{error}</p>}

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard icon={<CalendarCheck className="h-4 w-4 text-black" />} iconBg="bg-brand-600" label="Event registrations" value={v(stats?.rsvps)} />
          <StatCard icon={<ScanLine className="h-4 w-4 text-black" />} iconBg="bg-brand-600" label="Checked in" value={v(stats?.checkedIn)} />
          <StatCard icon={<Users className="h-4 w-4 text-black" />} iconBg="bg-brand-600" label="Community leads" value={v(stats?.leads)} />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <a
            href="/admin/events"
            className="flex items-center justify-between card p-5 card-hover"
          >
            <div>
              <p className="text-sm font-bold text-white">Event registrations</p>
              <p className="text-sm text-zinc-400">See who signed up, export to CSV.</p>
            </div>
            <ArrowRight className="h-4 w-4 text-white" />
          </a>
          <a
            href="/admin/checkin"
            className="flex items-center justify-between card p-5 card-hover"
          >
            <div>
              <p className="text-sm font-bold text-white">Gate check-in</p>
              <p className="text-sm text-zinc-400">Scan a ticket QR or type the code.</p>
            </div>
            <ArrowRight className="h-4 w-4 text-white" />
          </a>
        </div>
      </Container>
    </section>
  );
}
