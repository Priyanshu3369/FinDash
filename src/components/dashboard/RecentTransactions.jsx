import { ArrowUpRight, ArrowDownRight, MoveRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatDateShort, hexToRgba } from '../../utils/helpers';
import { categoryColors } from '../../data/transactions';
import { Link } from 'react-router-dom';

export default function RecentTransactions() {
  const { state } = useApp();
  const recentTxns = [...state.transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (!recentTxns.length) {
    return (
      <div className="rt-card">
        <h3 className="rt-title">Recent Transactions</h3>
        <div className="rt-empty">No transactions yet</div>
      </div>
    );
  }

  return (
    <>
      <div className="rt-card">
        <div className="rt-header">
          <div>
            <h3 className="rt-title">Recent Transactions</h3>
            <p className="rt-sub">Your latest activity</p>
          </div>
          <Link to="/transactions" className="rt-link">
            View all <MoveRight size={13} />
          </Link>
        </div>

        {/* Column headers */}
        <div className="rt-col-heads">
          <span>Description</span>
          <span>Category</span>
          <span>Date</span>
          <span style={{ textAlign: 'right' }}>Amount</span>
        </div>

        <div className="rt-list">
          {recentTxns.map((txn, idx) => {
            const isIncome = txn.type === 'income';
            const color = isIncome ? '#4ade80' : (categoryColors[txn.category] || '#64748b');
            return (
              <div
                key={txn.id}
                className="rt-row"
                style={{ animationDelay: `${idx * 55}ms` }}
              >
                {/* Description */}
                <div className="rt-desc-cell">
                  <span className="rt-type-icon" style={{ color }}>
                    {isIncome
                      ? <ArrowUpRight size={13} />
                      : <ArrowDownRight size={13} />}
                  </span>
                  <span className="rt-desc">{txn.description}</span>
                </div>

                {/* Category */}
                <span
                  className="rt-cat"
                  style={{ color, borderColor: hexToRgba(color, 0.25) }}
                >
                  {txn.category}
                </span>

                {/* Date */}
                <span className="rt-date">{formatDateShort(txn.date)}</span>

                {/* Amount */}
                <span
                  className="rt-amount"
                  style={{ color: isIncome ? '#4ade80' : '#f87171' }}
                >
                  {isIncome ? '+' : '−'}{formatCurrency(txn.amount)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .rt-card {
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: 12px;
          padding: 1.5rem;
          transition: border-color 0.2s;
        }
        .rt-card:hover { border-color: var(--c-border-hi); }

        .rt-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          gap: 1rem;
        }
        .rt-title {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 400;
          letter-spacing: -0.01em;
          color: var(--c-text-1);
          margin-bottom: 3px;
        }
        .rt-sub { font-size: 11px; color: var(--c-text-3); }

        .rt-link {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          font-weight: 500;
          color: var(--c-accent);
          text-decoration: none;
          padding: 5px 0;
          border-bottom: 1px solid transparent;
          transition: border-color 0.15s, color 0.15s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .rt-link:hover { border-color: var(--c-accent); }

        /* Column headers */
        .rt-col-heads {
          display: grid;
          grid-template-columns: 1fr 120px 90px 110px;
          gap: 0 1rem;
          padding: 0 10px 8px;
          border-bottom: 1px solid var(--c-border);
          margin-bottom: 4px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--c-text-3);
        }

        /* Rows */
        .rt-list { display: flex; flex-direction: column; }
        .rt-row {
          display: grid;
          grid-template-columns: 1fr 120px 90px 110px;
          gap: 0 1rem;
          align-items: center;
          padding: 11px 10px;
          border-radius: 8px;
          animation: rt-in 0.4s cubic-bezier(0.22,1,0.36,1) both;
          transition: background 0.15s;
          cursor: default;
        }
        .rt-row:hover { background: var(--c-hover-bg); }
        @keyframes rt-in {
          from { opacity:0; transform:translateY(6px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .rt-desc-cell {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 0;
        }
        .rt-type-icon {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          opacity: 0.85;
        }
        .rt-desc {
          font-size: 13px;
          font-weight: 500;
          color: var(--c-text-1);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .rt-cat {
          font-size: 11px;
          font-weight: 500;
          padding: 3px 8px;
          border-radius: 5px;
          border: 1px solid;
          letter-spacing: 0.02em;
          width: fit-content;
        }

        .rt-date {
          font-size: 11.5px;
          color: var(--c-text-3);
          font-variant-numeric: tabular-nums;
        }

        .rt-amount {
          font-size: 13px;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.01em;
          text-align: right;
        }

        .rt-empty {
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          color: var(--c-text-3);
        }

        /* Responsive: collapse table columns on mobile */
        @media (max-width: 768px) {
          .rt-col-heads { display: none; }
          .rt-row {
            grid-template-columns: auto 1fr auto;
            grid-template-rows: auto auto;
            gap: 2px 10px;
          }
          .rt-desc-cell { grid-column: 1 / 3; }
          .rt-amount     { grid-column: 3; grid-row: 1 / 3; align-self: center; }
          .rt-cat        { grid-row: 2; grid-column: 1; }
          .rt-date       { grid-row: 2; grid-column: 2; }
        }
      `}</style>
    </>
  );
}