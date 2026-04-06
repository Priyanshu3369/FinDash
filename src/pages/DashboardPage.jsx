import SummaryCards from '../components/dashboard/SummaryCards';
import BalanceTrendChart from '../components/dashboard/BalanceTrendChart';
import ExpenseBreakdownChart from '../components/dashboard/ExpenseBreakdownChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';

export default function DashboardPage() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  return (
    <div className="dash">
      {/* ── Page Header ── */}
      <header className="dash-header">
        <div>
          <p className="dash-eyebrow">{today}</p>
          <h1 className="dash-heading">Overview</h1>
        </div>
        <div className="dash-live">
          <span className="dash-live-dot" />
          Live
        </div>
      </header>

      <div className="dash-rule" />

      <SummaryCards />

      <div className="dash-charts">
        <div className="dash-chart-main"><BalanceTrendChart /></div>
        <div className="dash-chart-side"><ExpenseBreakdownChart /></div>
      </div>

      <RecentTransactions />

      <style>{`
        .dash {
          font-family: var(--font-body);
          color: var(--c-text-1);
          display: flex;
          flex-direction: column;
          gap: 2.25rem;
        }
        .dash-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }
        .dash-eyebrow {
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: var(--c-text-3);
          margin-bottom: 5px;
        }
        .dash-heading {
          font-family: var(--font-display);
          font-size: 2.4rem;
          font-weight: 400;
          letter-spacing: -0.025em;
          color: var(--c-text-1);
          line-height: 1;
        }
        .dash-live {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--c-income);
          padding-bottom: 3px;
        }
        .dash-live-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--c-income);
          animation: blink 2.4s ease-in-out infinite;
        }
        @keyframes blink {
          0%,100% { opacity:1; } 50% { opacity:0.25; }
        }
        .dash-rule {
          height: 1px;
          background: var(--c-border);
          margin-top: -1rem;
        }
        .dash-charts {
          display: grid;
          grid-template-columns: 1fr 356px;
          gap: 1.25rem;
          align-items: stretch;
        }
        @media (max-width: 1024px) { .dash-charts { grid-template-columns: 1fr; } }
        @media (max-width: 480px) {
          .dash { gap: 1.75rem; }
          .dash-heading { font-size: 1.8rem; }
        }
      `}</style>
    </div>
  );
}