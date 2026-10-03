"use client";

import { useEffect, useState } from "react";
import { Users, CalendarCheck, ScanLine, Sprout, ArrowRight } from "lucide-react";
import { Container, StatCard } from "@/components/ui";
import { useAdmin } from "@/components/admin/AdminGate";

type Stats = {
  leads: number;
  rsvps: number;
  checkedIn: number;
  applications: number;
};

export default function AdminOverviewPage() {
  const { authFetch, email } = useAdmin();
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

  const links = [
    { href: "/admin/events", icon: CalendarCheck, title: "Event registrations", desc: "See who signed up for events, check people in, export to CSV." },
    { href: "/admin/seed", icon: Sprout, title: "Seed registrations", desc: "Track trainees and decide who gets seed capital." },
    { href: "/admin/community", icon: Users, title: "Community", desc: "Everyone who joined through the website, with CSV export." },
    { href: "/admin/checkin", icon: ScanLine, title: "Gate check-in", desc: "Scan a ticket QR or type the code at the door." },
  ];

  return (
    <section className="py-8">
      <Container className="max-w-none px-6">
        <p className="text-sm text-zinc-400">Welcome back{email ? `, ${email.split("@")[0]}` : ""}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">Overview</h1>
        {error && <p className="mt-4 text-sm text-danger">{error}</p>}

        <p className="mb-3 mt-8 text-xs font-semibold uppercase tracking-widest text-zinc-500">Live counts</p>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={<CalendarCheck className="h-4 w-4 text-black" />} iconBg="bg-brand-600" label="Event registrations" value={v(stats?.rsvps)} />
          <StatCard icon={<ScanLine className="h-4 w-4 text-brand-500" />} iconBg="bg-brand-500/10" label="Checked in" value={v(stats?.checkedIn)} />
          <StatCard icon={<Sprout className="h-4 w-4 text-black" />} iconBg="bg-brand-600" label="Seed registrations" value={v(stats?.applications)} />
          <StatCard icon={<Users className="h-4 w-4 text-brand-500" />} iconBg="bg-brand-500/10" label="Community leads" value={v(stats?.leads)} />
        </div>

        <p className="mb-3 mt-10 text-xs font-semibold uppercase tracking-widest text-zinc-500">Go to</p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="card card-hover group flex flex-col p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-zinc-400 transition-colors group-hover:bg-brand-500 group-hover:text-black">
                <l.icon className="h-5 w-5" />
              </span>
              <p className="mt-5 text-base font-bold text-white">{l.title}</p>
              <p className="mt-1 flex-1 text-sm text-zinc-400">{l.desc}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-white">
                Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
