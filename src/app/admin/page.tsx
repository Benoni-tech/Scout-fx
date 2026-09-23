import { Container, StatCard } from "@/components/ui";
import { Users, CalendarCheck, ListChecks, Mail } from "lucide-react";

// TODO: gate this route behind Firebase Auth (admin-only) before deploying.
// TODO: replace with live counts from Firestore: leads, rsvps, subscribers, signals.

export default function AdminOverviewPage() {
  return (
    <section className="py-16">
      <Container>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">
          Admin overview
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          Snapshot of leads, subscribers, RSVPs and signal performance.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={<Users className="h-4 w-4 text-brand-600" />} iconBg="bg-brand-50" label="Total leads" value="N/A" />
          <StatCard icon={<Mail className="h-4 w-4 text-brand-600" />} iconBg="bg-brand-50" label="Newsletter subscribers" value="N/A" />
          <StatCard icon={<CalendarCheck className="h-4 w-4 text-success" />} iconBg="bg-success/10" label="Event RSVPs" value="N/A" />
          <StatCard icon={<ListChecks className="h-4 w-4 text-success" />} iconBg="bg-success/10" label="Signals this month" value="N/A" />
        </div>

        <div className="mt-12 rounded-2xl border border-dashed border-ink-100 bg-ink-100/20 p-8 text-center text-sm text-ink-500">
          Connect this page to Firestore (leads, subscribers, rsvps, signals
          collections) to populate live numbers. Add /admin/leads,
          /admin/events and /admin/rules as the next build pass.
        </div>
      </Container>
    </section>
  );
}
