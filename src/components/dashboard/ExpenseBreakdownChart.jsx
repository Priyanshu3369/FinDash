import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useInsights } from '../../hooks/useInsights';
import { categoryColors } from '../../data/transactions';
import { formatCurrency } from '../../utils/helpers';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="eb-tip">
      <span className="eb-tip-dot" style={{ background: d.payload.fill }} />
      <div>
        <p className="eb-tip-name">{d.name}</p>
        <p className="eb-tip-val" style={{ color: d.payload.fill }}>
          {formatCurrency(d.value)}
        </p>
      </div>
    </div>
  );
};

export default function ExpenseBreakdownChart() {
  const { categoryBreakdown, totalExpenses } = useInsights();

  if (!categoryBreakdown.length) {
    return (
      <div className="eb-card">
        <h3 className="eb-title">Expense Breakdown</h3>
        <div className="eb-empty">No data</div>
      </div>
    );
  }

  return (
    <>
      <div className="eb-card">
        <div className="eb-header">
          <h3 className="eb-title">Expenses</h3>
          <p className="eb-sub">By category</p>
        </div>

        {/* Donut */}
        <div className="eb-donut">
          <div className="eb-center">
            <span className="eb-center-label">Total</span>
            <span className="eb-center-val">{formatCurrency(totalExpenses)}</span>
          </div>

          <ResponsiveContainer width="100%" height={188}>
            <PieChart>
              <Pie
                data={categoryBreakdown}
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={86}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
                cornerRadius={2}
                startAngle={90} endAngle={-270}
              >
                {categoryBreakdown.map((entry) => (
                  <Cell key={entry.name} fill={categoryColors[entry.name] || '#64748b'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend — horizontal bar rows */}
        <div className="eb-legend">
          {categoryBreakdown.slice(0, 6).map(({ name, value }) => {
            const pct = ((value / totalExpenses) * 100).toFixed(0);
            const color = categoryColors[name] || '#64748b';
            return (
              <div key={name} className="eb-row">
                <div className="eb-row-top">
                  <span className="eb-row-dot" style={{ background: color }} />
                  <span className="eb-row-name">{name}</span>
                  <span className="eb-row-pct">{pct}%</span>
                </div>
                <div className="eb-bar-bg">
                  <div
                    className="eb-bar-fill"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .eb-card {
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: 12px;
          padding: 1.5rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: border-color 0.2s;
        }
        .eb-card:hover { border-color: var(--c-border-hi); }

        .eb-header { margin-bottom: 0.25rem; }
        .eb-title {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 400;
          letter-spacing: -0.01em;
          color: var(--c-text-1);
          margin-bottom: 3px;
        }
        .eb-sub { font-size: 11px; color: var(--c-text-3); }

        .eb-empty {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          color: var(--c-text-3);
        }

        /* Donut */
        .eb-donut {
          position: relative;
          flex-shrink: 0;
        }
        .eb-center {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .eb-center-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--c-text-3);
        }
        .eb-center-val {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 400;
          letter-spacing: -0.02em;
          color: var(--c-text-1);
          margin-top: 2px;
        }

        /* Legend */
        .eb-legend {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 0.5rem;
        }
        .eb-row { display: flex; flex-direction: column; gap: 5px; }
        .eb-row-top {
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .eb-row-dot {
          width: 7px; height: 7px;
          border-radius: 2px;
          flex-shrink: 0;
        }
        .eb-row-name {
          flex: 1;
          font-size: 12px;
          font-weight: 400;
          color: var(--c-text-2);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .eb-row-pct {
          font-size: 11.5px;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
          color: var(--c-text-1);
        }
        .eb-bar-bg {
          height: 2px;
          background: var(--c-bar-bg);
          border-radius: 99px;
          overflow: hidden;
        }
        .eb-bar-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 0.7s cubic-bezier(0.22,1,0.36,1);
        }

        /* Tooltip */
        .eb-tip {
          display: flex;
          align-items: center;
          gap: 9px;
          background: var(--c-tooltip);
          border: 1px solid var(--c-border-hi);
          border-radius: 8px;
          padding: 9px 12px;
          font-family: var(--font-body);
          box-shadow: var(--c-shadow-lg);
        }
        .eb-tip-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
        .eb-tip-name { font-size:11px; color:var(--c-text-2); margin:0 0 2px; }
        .eb-tip-val  { font-size:12.5px; font-weight:600; font-variant-numeric:tabular-nums; margin:0; }
      `}</style>
    </>
  );
}