import Image from "next/image";
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
    <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/80 shadow-card backdrop-blur">
      <div className="flex">
        {/* mini sidebar */}
        <div className="hidden w-40 shrink-0 border-r border-white/10 p-4 sm:block">
          <div className="mb-6 flex items-center gap-1.5 px-1">
            <Image src="/logo.png" alt="" width={12} height={14} className="h-3.5 w-auto" />
            <span className="text-sm font-extrabold text-white">
              Scout FX
            </span>
          </div>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium ${
                  item.active
                    ? "bg-brand-500/10 text-brand-500"
                    : "text-zinc-400"
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
              <p className="text-sm font-bold text-white">
                Welcome back, Scout FX
              </p>
              <p className="text-xs text-zinc-400">
                Here&apos;s this week&apos;s campaign snapshot
              </p>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <div className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-500">
                <Search className="h-3 w-3" />
                Search
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10">
                <Bell className="h-3.5 w-3.5 text-zinc-400" />
              </div>
              <div className="flex items-center gap-1 rounded-full bg-brand-600 px-3 py-1.5 text-xs font-semibold text-black">
                <Plus className="h-3 w-3" />
                New signal
              </div>
            </div>
          </div>

          <p className="mb-2 mt-5 text-xs font-semibold text-zinc-400">
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
                className="rounded-xl border border-white/10 p-3"
              >
                <p className="text-[10px] font-medium text-zinc-500">
                  {s.label}
                </p>
                <p className="mt-1 text-lg font-extrabold text-white">
                  {s.value}
                </p>
                <p className="text-[10px] font-semibold text-white">
                  {s.delta}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 p-3 sm:col-span-2">
              <p className="text-[10px] font-medium text-zinc-500">
                Community growth (30 days)
              </p>
              <svg viewBox="0 0 300 80" className="mt-2 w-full overflow-visible">
                <defs>
                  <linearGradient id="dp-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FBFE00" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#FBFE00" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon
                  fill="url(#dp-fill)"
                  points="0,80 0,60 30,58 60,50 90,52 120,40 150,42 180,30 210,32 240,18 270,20 300,8 300,80"
                />
                <polyline
                  fill="none"
                  stroke="#FBFE00"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="1000"
                  className="animate-draw"
                  points="0,60 30,58 60,50 90,52 120,40 150,42 180,30 210,32 240,18 270,20 300,8"
                />
                <circle cx="300" cy="8" r="4" fill="#FBFE00" className="animate-pulse-glow" />
              </svg>
            </div>
            <div className="rounded-xl border border-white/10 p-3">
              <p className="text-[10px] font-medium text-zinc-500">
                Recent signals
              </p>
              <div className="mt-2 space-y-2">
                {recentSignals.map((s) => (
                  <div
                    key={s.pair}
                    className="flex items-center justify-between text-[11px]"
                  >
                    <span className="font-semibold text-white">
                      {s.pair}
                    </span>
                    <span
                      className={
                        s.dir === "BUY"
                          ? "font-semibold text-white"
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
