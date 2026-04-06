import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { useInsights } from '../../hooks/useInsights';
import { formatCurrency } from '../../utils/helpers';

const cards = [
  {
    key: 'balance',
    label: 'Net Balance',
    icon: Wallet,
    accentColor: '#818cf8',
    getValue: (i) => i.totalBalance,
    getDetail: (i) => `${i.transactionCount} transactions`,
    changePositive: true,
  },
  {
    key: 'income',
    label: 'Total Income',
    icon: TrendingUp,
    accentColor: '#4ade80',
    getValue: (i) => i.totalIncome,
    getDetail: (i) => `${i.incomeCount} deposits`,
    changePositive: true,
  },
  {
    key: 'expenses',
    label: 'Total Expenses',
    icon: TrendingDown,
    accentColor: '#f87171',
    getValue: (i) => i.totalExpenses,
    getDetail: (i) => `${i.expenseCount} payments`,
    changePositive: false,
  },
];

export default function SummaryCards() {
  const insights = useInsights();

  return (
    <>
      <div className="sc-grid">
        {cards.map(({ key, label, icon: Icon, accentColor, getValue, getDetail, changePositive }, idx) => (
          <div
            key={key}
            className="sc-card"
            style={{ '--accent': accentColor, animationDelay: `${idx * 70}ms` }}
          >
            {/* Top accent line */}
            <div className="sc-accent-line" />

            <div className="sc-body">
              {/* Label row */}
              <div className="sc-label-row">
                <span className="sc-label">{label}</span>
                <span className="sc-icon">
                  <Icon size={14} />
                </span>
              </div>

              {/* Value */}
              <p className="sc-value">{formatCurrency(getValue(insights))}</p>

              {/* Footer */}
              <div className="sc-footer">
                <span
                  className="sc-indicator"
                  style={{ color: changePositive ? 'var(--c-income)' : 'var(--c-expense)' }}
                >
                  {changePositive ? '↑' : '↓'}
                </span>
                <span className="sc-detail">{getDetail(insights)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .sc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .sc-card {
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: 12px;
          overflow: hidden;
          animation: sc-in 0.45s cubic-bezier(0.22,1,0.36,1) both;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
          cursor: default;
        }
        .sc-card:hover {
          border-color: var(--c-border-hi);
          box-shadow: var(--c-shadow-md);
          transform: translateY(-2px);
        }
        @keyframes sc-in {
          from { opacity:0; transform: translateY(12px); }
          to   { opacity:1; transform: translateY(0); }
        }

        /* Thin colored top border */
        .sc-accent-line {
          height: 2px;
          background: var(--accent);
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        .sc-card:hover .sc-accent-line { opacity: 1; }

        .sc-body {
          padding: 1.25rem 1.4rem 1.3rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .sc-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .sc-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--c-text-3);
        }
        .sc-icon {
          color: var(--accent);
          opacity: 0.8;
          display: flex;
          align-items: center;
        }

        .sc-value {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 400;
          letter-spacing: -0.03em;
          color: var(--c-text-1);
          line-height: 1;
        }

        .sc-footer {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 2px;
        }
        .sc-indicator {
          font-size: 13px;
          font-weight: 600;
          line-height: 1;
        }
        .sc-detail {
          font-size: 11.5px;
          color: var(--c-text-2);
        }

        @media (max-width: 768px) {
          .sc-grid { grid-template-columns: repeat(2,1fr); }
        }
        @media (max-width: 480px) {
          .sc-grid { grid-template-columns: 1fr; }
          .sc-value { font-size: 1.75rem; }
        }
      `}</style>
    </>
  );
}