import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart,
} from 'recharts';
import { balanceTrendData } from '../../data/transactions';
import { formatCurrency } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bt-tip">
      <p className="bt-tip-label">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="bt-tip-row">
          <span className="bt-tip-swatch" style={{ background: entry.color }} />
          <span className="bt-tip-name">{entry.name}</span>
          <span className="bt-tip-val" style={{ color: entry.color }}>
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function BalanceTrendChart() {
  const { state } = useApp();
  const isDark = state.darkMode;

  return (
    <>
      <div className="bt-card">
        <div className="bt-header">
          <div>
            <h3 className="bt-title">Balance Trend</h3>
            <p className="bt-sub">Last 7 months</p>
          </div>
          <div className="bt-legend">
            {[
              { label: 'Income',   color: '#818cf8' },
              { label: 'Expenses', color: '#f87171' },
            ].map(({ label, color }) => (
              <span key={label} className="bt-leg-item">
                <span className="bt-leg-dash" style={{ background: color }} />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="bt-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={balanceTrendData} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="btIG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#818cf8" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="btEG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#f87171" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#f87171" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                axisLine={false} tickLine={false}
                tick={{ fontSize: 11, fill: isDark ? '#4a5168' : '#94a3b8', fontFamily: 'Inter, sans-serif' }}
                dy={10}
              />
              <YAxis
                axisLine={false} tickLine={false}
                tick={{ fontSize: 11, fill: isDark ? '#4a5168' : '#94a3b8', fontFamily: 'Inter, sans-serif' }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                dx={-4}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', strokeWidth: 1 }}
              />
              <Area
                type="monotone" dataKey="income" name="Income"
                stroke="#818cf8" strokeWidth={2} fill="url(#btIG)"
                dot={false}
                activeDot={{ r: 4, fill: '#818cf8', stroke: isDark ? '#0f1117' : '#ffffff', strokeWidth: 2 }}
              />
              <Area
                type="monotone" dataKey="expenses" name="Expenses"
                stroke="#f87171" strokeWidth={2} fill="url(#btEG)"
                dot={false}
                activeDot={{ r: 4, fill: '#f87171', stroke: isDark ? '#0f1117' : '#ffffff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <style>{`
        .bt-card {
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: 12px;
          padding: 1.5rem 1.5rem 1.25rem;
          height: 100%;
          display: flex;
          flex-direction: column;
          transition: border-color 0.2s;
        }
        .bt-card:hover { border-color: var(--c-border-hi); }

        .bt-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1.4rem;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .bt-title {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 400;
          letter-spacing: -0.01em;
          color: var(--c-text-1);
          margin-bottom: 3px;
        }
        .bt-sub {
          font-size: 11px;
          color: var(--c-text-3);
          letter-spacing: 0.03em;
        }

        .bt-legend {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .bt-leg-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 11.5px;
          font-weight: 400;
          color: var(--c-text-2);
        }
        .bt-leg-dash {
          width: 18px;
          height: 2px;
          border-radius: 99px;
        }

        .bt-chart {
          flex: 1;
          min-height: 260px;
        }

        /* Tooltip */
        .bt-tip {
          background: var(--c-tooltip);
          border: 1px solid var(--c-border-hi);
          border-radius: 8px;
          padding: 9px 12px;
          font-family: var(--font-body);
          box-shadow: var(--c-shadow-lg);
        }
        .bt-tip-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--c-text-3);
          margin-bottom: 6px;
        }
        .bt-tip-row {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 2px 0;
        }
        .bt-tip-swatch {
          width: 6px; height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .bt-tip-name {
          font-size: 11px;
          color: var(--c-text-2);
          flex: 1;
        }
        .bt-tip-val {
          font-size: 11.5px;
          font-weight: 600;
          font-variant-numeric: tabular-nums;
          margin-left: 14px;
        }
      `}</style>
    </>
  );
}