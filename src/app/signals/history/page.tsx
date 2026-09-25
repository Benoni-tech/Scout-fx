import { Container, Eyebrow, StatCard } from "@/components/ui";
import { ListChecks, Target, TrendingUp, TrendingDown } from "lucide-react";

// TODO: replace with a live Firestore query against `signals`, all statuses,
// and computed stats from `signalPerformance`
const history = [
  { pair: "XAU/USD", direction: "BUY", entry: 2398.2, result: "TARGET", pnl: "+1.6R", date: "Aug 24" },
  { pair: "EUR/USD", direction: "SELL", entry: 1.091, result: "STOP", pnl: "-1R", date: "Aug 22" },
  { pair: "GBP/USD", direction: "BUY", entry: 1.258, result: "TARGET", pnl: "+2.1R", date: "Aug 19" },
  { pair: "XAU/USD", direction: "SELL", entry: 2421.0, result: "TARGET", pnl: "+1.4R", date: "Aug 15" },
  { pair: "EUR/USD", direction: "BUY", entry: 1.0835, result: "STOP", pnl: "-1R", date: "Aug 12" },
];

export default function SignalHistoryPage() {
  return (
    <section className="py-16">
      <Container>
        <Eyebrow>Full, unedited history</Eyebrow>
        <h1 className="mt-5 max-w-xl text-4xl font-bold leading-[1.05] tracking-tight text-gradient animate-fade-up pb-1 sm:text-5xl">
          Signal track record
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-zinc-400">
          Every signal ever issued, wins and losses, logged the moment it
          fired. Nothing here is cherry-picked or removed after the fact.
        </p>

        <div className="mt-10 grid grid-cols-3 gap-4">
          <StatCard icon={<ListChecks className="h-4 w-4 text-brand-500" />} iconBg="bg-brand-500/10" label="Total signals" value="312" />
          <StatCard icon={<Target className="h-4 w-4 text-black" />} iconBg="bg-brand-600" label="Win rate" value="58%" />
          <StatCard icon={<TrendingUp className="h-4 w-4 text-brand-500" />} iconBg="bg-brand-500/10" label="Avg. R:R" value="1:1.8" />
        </div>

        <div className="mt-10 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.03] text-xs font-semibold uppercase text-zinc-400">
              <tr>
                <th className="px-5 py-3">Pair</th>
                <th className="px-5 py-3">Direction</th>
                <th className="px-5 py-3">Entry</th>
                <th className="px-5 py-3">Result</th>
                <th className="px-5 py-3">P&amp;L</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i} className="border-t border-white/10">
                  <td className="px-5 py-3 font-semibold text-white">{h.pair}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        h.direction === "BUY" ? "text-brand-500" : "text-danger"
                      }`}
                    >
                      {h.direction === "BUY" ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {h.direction}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-zinc-300">{h.entry}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        h.result === "TARGET"
                          ? "bg-brand-600 text-black"
                          : "bg-danger/10 text-danger"
                      }`}
                    >
                      {h.result}
                    </span>
                  </td>
                  <td
                    className={`px-5 py-3 font-semibold ${
                      h.pnl.startsWith("+") ? "text-brand-500" : "text-danger"
                    }`}
                  >
                    {h.pnl}
                  </td>
                  <td className="px-5 py-3 text-zinc-400">{h.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-zinc-500">
          Figures shown are illustrative sample data for this build. Once
          live, this table renders directly from the immutable{" "}
          <code>signals</code> collection. No manual entry.
        </p>
      </Container>
    </section>
  );
}
