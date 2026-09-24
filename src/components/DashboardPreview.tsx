import {
  Home,
  LayoutDashboard,
  Users,
  TrendingUp,
  BarChart3,
  Search,
  Bell,
  Plus,
} from "lucide-react";

const sidebarItems = [
  { icon: Home, label: "Home" },
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: TrendingUp, label: "Signals" },
  { icon: Users, label: "Community" },
  { icon: BarChart3, label: "Analytics" },
];

const recentSignals = [
  { pair: "XAU/USD", dir: "BUY", time: "2m ago" },
  { pair: "EUR/USD", dir: "SELL", time: "41m ago" },
  { pair: "GBP/USD", dir: "BUY", time: "3h ago" },
];

export default function DashboardPreview() {
  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card">
      <div className="flex">
        {/* mini sidebar */}
        <div className="hidden w-40 shrink-0 border-r border-ink-100 p-4 sm:block">
          <div className="mb-6 flex items-center gap-1.5 px-1">
            <span className="text-brand-800">✳</span>
            <span className="text-sm font-extrabold text-ink-900">
              Scout FX
            </span>
          </div>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium ${
                  item.active
                    ? "bg-brand-50 text-brand-800"
                    : "text-ink-500"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </div>
            ))}
          </nav>
        </div>

        {/* main content */}
        <div className="flex-1 p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-ink-900">
                Welcome back, Scout FX
              </p>
              <p className="text-xs text-ink-500">
                Here&apos;s this week&apos;s campaign snapshot
              </p>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex items-center gap-1.5 rounded-full border border-ink-100 px-3 py-1.5 text-xs text-ink-300">
                <Search className="h-3 w-3" />
                Search
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-100">
                <Bell className="h-3.5 w-3.5 text-ink-500" />
              </div>
              <div className="flex items-center gap-1 rounded-full bg-brand-600 px-3 py-1.5 text-xs font-semibold text-ink-900">
                <Plus className="h-3 w-3" />
                New signal
              </div>
            </div>
          </div>

          <p className="mb-2 mt-5 text-xs font-semibold text-ink-500">
            Data overview
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Registrations", value: "250", delta: "+18%" },
              { label: "Active traders", value: "100", delta: "+9%" },
              { label: "Trading lots", value: "200", delta: "+12%" },
              { label: "Net deposits", value: "$25K", delta: "+6%" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-ink-100 p-3"
              >
                <p className="text-[10px] font-medium text-ink-300">
                  {s.label}
                </p>
                <p className="mt-1 text-lg font-extrabold text-ink-900">
                  {s.value}
                </p>
                <p className="text-[10px] font-semibold text-ink-900">
                  {s.delta}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-ink-100 p-3 sm:col-span-2">
              <p className="text-[10px] font-medium text-ink-300">
                Community growth (30 days)
              </p>
              <svg viewBox="0 0 300 80" className="mt-2 w-full">
                <polyline
                  fill="none"
                  stroke="#0B0B10"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="0,60 30,58 60,50 90,52 120,40 150,42 180,30 210,32 240,18 270,20 300,8"
                />
              </svg>
            </div>
            <div className="rounded-xl border border-ink-100 p-3">
              <p className="text-[10px] font-medium text-ink-300">
                Recent signals
              </p>
              <div className="mt-2 space-y-2">
                {recentSignals.map((s) => (
                  <div
                    key={s.pair}
                    className="flex items-center justify-between text-[11px]"
                  >
                    <span className="font-semibold text-ink-900">
                      {s.pair}
                    </span>
                    <span
                      className={
                        s.dir === "BUY"
                          ? "font-semibold text-ink-900"
                          : "font-semibold text-danger"
                      }
                    >
                      {s.dir}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
