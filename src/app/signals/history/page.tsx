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
        <h1 className="mt-5 max-w-xl text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
          Signal track record
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-500">
          Every signal ever issued, wins and losses, logged the moment it
          fired. Nothing here is cherry-picked or removed after the fact.
        </p>

        <div className="mt-10 grid grid-cols-3 gap-4">
          <StatCard icon={<ListChecks className="h-4 w-4 text-brand-600" />} iconBg="bg-brand-50" label="Total signals" value="312" />
          <StatCard icon={<Target className="h-4 w-4 text-success" />} iconBg="bg-success/10" label="Win rate" value="58%" />
          <StatCard icon={<TrendingUp className="h-4 w-4 text-brand-600" />} iconBg="bg-brand-50" label="Avg. R:R" value="1:1.8" />
        </div>

        <div className="mt-10 overflow-x-auto rounded-2xl border border-ink-100">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-100/30 text-xs font-semibold uppercase text-ink-500">
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
                <tr key={i} className="border-t border-ink-100">
                  <td className="px-5 py-3 font-semibold text-ink-900">{h.pair}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        h.direction === "BUY" ? "text-success" : "text-danger"
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
                  <td className="px-5 py-3 text-ink-700">{h.entry}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        h.result === "TARGET"
                          ? "bg-success/10 text-success"
                          : "bg-danger/10 text-danger"
                      }`}
                    >
                      {h.result}
                    </span>
                  </td>
                  <td
                    className={`px-5 py-3 font-semibold ${
                      h.pnl.startsWith("+") ? "text-success" : "text-danger"
                    }`}
                  >
                    {h.pnl}
                  </td>
                  <td className="px-5 py-3 text-ink-500">{h.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-ink-300">
          Figures shown are illustrative sample data for this build. Once
          live, this table renders directly from the immutable{" "}
          <code>signals</code> collection. No manual entry.
        </p>
      </Container>
    </section>
  );
}
