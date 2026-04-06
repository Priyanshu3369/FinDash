import {
  TrendingUp, TrendingDown, PiggyBank, BarChart3,
  ArrowUpRight, ArrowDownRight, Calendar, Target,
  Zap, ShieldCheck, Activity, Sparkles,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { useInsights } from '../hooks/useInsights';
import { useApp } from '../context/AppContext';
import { categoryColors } from '../data/transactions';
import { formatCurrency, getMonthName } from '../utils/helpers';

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, detail, color, bgColor, trend, index }) {
  const trendColor =
    trend === 'up' ? 'var(--c-income)' :
    trend === 'down' ? 'var(--c-expense)' :
    'var(--c-text-3)';

  return (
    <div
      className="ip-stat-card"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* top row */}
      <div className="ip-stat-card__top">
        <span className="ip-stat-card__label">{label}</span>
        <div className="ip-stat-card__icon-wrap" style={{ background: bgColor }}>
          <Icon size={16} style={{ color }} />
        </div>
      </div>

      {/* value */}
      <p className="ip-stat-card__value">{value}</p>

      {/* detail */}
      <div className="ip-stat-card__detail">
        {trend && (
          <span className="ip-stat-card__trend-arrow" style={{ color: trendColor }}>
            {trend === 'up' ? '↑' : '↓'}
          </span>
        )}
        <span className="ip-stat-card__detail-text">{detail}</span>
      </div>

      {/* accent bar */}
      <div className="ip-stat-card__accent" style={{ background: color }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMPARISON ROW
───────────────────────────────────────────── */
function ComparisonRow({ label, icon: Icon, iconColor, iconBg, prevValue, currValue, prevLabel, currLabel, barColor }) {
  const maxVal = Math.max(prevValue, currValue, 1);
  const prevPct = (prevValue / maxVal) * 100;
  const currPct = (currValue / maxVal) * 100;
  const change = prevValue > 0 ? ((currValue - prevValue) / prevValue * 100).toFixed(1) : null;
  const up = currValue >= prevValue;

  return (
    <div className="ip-comparison-row">
      <div className="ip-comparison-row__header">
        <div className="ip-comparison-row__icon-wrap" style={{ background: iconBg }}>
          <Icon size={14} style={{ color: iconColor }} />
        </div>
        <span className="ip-comparison-row__label">{label}</span>
        {change !== null && (
          <span
            className="ip-comparison-row__badge"
            style={{
              background: up ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)',
              color: up ? '#ef4444' : '#10b981',
            }}
          >
            {up ? '▲' : '▼'} {Math.abs(change)}%
          </span>
        )}
      </div>

      <div className="ip-comparison-row__bars">
        {/* Previous */}
        <div className="ip-comparison-bar-group">
          <div className="ip-comparison-bar-group__meta">
            <span className="ip-comparison-bar-group__month">{prevLabel}</span>
            <span className="ip-comparison-bar-group__amount">{formatCurrency(prevValue)}</span>
          </div>
          <div className="ip-progress-track">
            <div
              className="ip-progress-fill"
              style={{ width: `${prevPct}%`, background: barColor, opacity: 0.3 }}
            />
          </div>
        </div>

        {/* Current */}
        <div className="ip-comparison-bar-group">
          <div className="ip-comparison-bar-group__meta">
            <span className="ip-comparison-bar-group__month">{currLabel}</span>
            <span className="ip-comparison-bar-group__amount ip-comparison-bar-group__amount--current">{formatCurrency(currValue)}</span>
          </div>
          <div className="ip-progress-track">
            <div
              className="ip-progress-fill"
              style={{ width: `${currPct}%`, background: barColor }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   INSIGHT CARD
───────────────────────────────────────────── */
function InsightCard({ icon: Icon, title, description, color, bgColor, borderColor }) {
  return (
    <div
      className="ip-insight-card"
      style={{ '--accent': color, '--accent-bg': bgColor, '--accent-border': borderColor }}
    >
      <div className="ip-insight-card__icon-wrap" style={{ background: bgColor }}>
        <Icon size={15} style={{ color }} />
      </div>
      <div>
        <p className="ip-insight-card__title">{title}</p>
        <p className="ip-insight-card__desc">{description}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   CUSTOM TOOLTIP
───────────────────────────────────────────── */
const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="ip-chart-tooltip">
      <p className="ip-chart-tooltip__label">{label}</p>
      <p className="ip-chart-tooltip__value" style={{ color: payload[0].payload.fill }}>
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function InsightsPage() {
  const insights = useInsights();
  const { state } = useApp();
  const isDark = state.darkMode;

  const now = new Date();
  const currentMonthName = getMonthName(now.getMonth());
  const prevMonthIndex = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
  const prevMonthName = getMonthName(prevMonthIndex);

  const categoryData = insights.categoryBreakdown.slice(0, 6);

  const stats = [
    {
      icon: Target,
      label: 'Top Spending Category',
      value: insights.highestCategory.name,
      detail: formatCurrency(insights.highestCategory.value),
      color: '#f59e0b',
      bgColor: 'rgba(245,158,11,0.12)',
      trend: null,
    },
    {
      icon: PiggyBank,
      label: 'Savings Rate',
      value: `${insights.savingsRate.toFixed(1)}%`,
      detail: `${formatCurrency(insights.totalIncome - insights.totalExpenses)} saved`,
      color: '#10b981',
      bgColor: 'rgba(16,185,129,0.12)',
      trend: insights.savingsRate >= 20 ? 'up' : 'down',
    },
    {
      icon: BarChart3,
      label: 'Avg Daily Expense',
      value: formatCurrency(insights.avgDailyExpense),
      detail: `${insights.expenseCount} transactions`,
      color: '#6366f1',
      bgColor: 'rgba(99,102,241,0.12)',
      trend: null,
    },
    {
      icon: Calendar,
      label: 'Monthly Change',
      value: `${insights.monthlyChange >= 0 ? '+' : ''}${insights.monthlyChange.toFixed(1)}%`,
      detail: `vs ${prevMonthName}`,
      color: insights.monthlyChange <= 0 ? '#10b981' : '#ef4444',
      bgColor: insights.monthlyChange <= 0 ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
      trend: insights.monthlyChange <= 0 ? 'down' : 'up',
    },
  ];

  return (
    <>
      {/* ── Injected Styles ───────────────────── */}
      <style>{`
        /* ── Page ── */
        .ip-page {
          display: flex;
          flex-direction: column;
          gap: 28px;
          padding: 8px 0 40px;
          font-family: var(--font-body);
          animation: ip-fadein 0.4s ease both;
        }
        @keyframes ip-fadein {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:none; }
        }

        /* ── Page Header ── */
        .ip-page-header { display: flex; flex-direction: column; gap: 4px; }
        .ip-page-header__eyebrow {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--c-accent);
        }
        .ip-page-header__title {
          font-size: 24px; font-weight: 700; letter-spacing: -0.6px;
          color: var(--c-text-1); line-height: 1.2;
        }
        .ip-page-header__subtitle {
          font-size: 13px; color: var(--c-text-3); margin-top: 2px;
        }

        /* ── Stat Grid ── */
        .ip-stat-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 1024px) { .ip-stat-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px)  { .ip-stat-grid { grid-template-columns: 1fr; } }

        /* ── Stat Card ── */
        .ip-stat-card {
          position: relative;
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: 16px;
          padding: 20px 20px 22px;
          overflow: hidden;
          animation: ip-fadeSlideUp 0.4s both ease-out;
          transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
        }
        .ip-stat-card:hover {
          box-shadow: var(--c-shadow-lg);
          transform: translateY(-2px);
          border-color: var(--c-border-hi);
        }
        .ip-stat-card__accent {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 3px; opacity: 0.7;
          border-radius: 0 0 16px 16px;
        }
        .ip-stat-card__top {
          display: flex; align-items: center;
          justify-content: space-between; margin-bottom: 14px;
        }
        .ip-stat-card__label {
          font-size: 11.5px; font-weight: 600; letter-spacing: 0.02em;
          color: var(--c-text-3); text-transform: uppercase;
        }
        .ip-stat-card__icon-wrap {
          width: 36px; height: 36px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ip-stat-card__value {
          font-size: 26px; font-weight: 700; letter-spacing: -0.8px;
          color: var(--c-text-1); line-height: 1;
          margin-bottom: 8px;
        }
        .ip-stat-card__detail {
          display: flex; align-items: center; gap: 4px;
        }
        .ip-stat-card__trend-arrow { font-size: 12px; font-weight: 700; }
        .ip-stat-card__detail-text {
          font-size: 12px; color: var(--c-text-3);
        }

        /* ── Charts Row ── */
        .ip-charts-row {
          display: grid;
          grid-template-columns: 5fr 7fr;
          gap: 16px;
          align-items: start;
        }
        @media (max-width: 1024px) { .ip-charts-row { grid-template-columns: 1fr; } }

        /* ── Panel (shared card shell) ── */
        .ip-panel {
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: 16px;
          padding: 24px;
          transition: box-shadow 0.2s;
        }
        .ip-panel:hover { box-shadow: var(--c-shadow-md); }

        .ip-panel__header { margin-bottom: 20px; }
        .ip-panel__title {
          font-size: 14px; font-weight: 700;
          color: var(--c-text-1); letter-spacing: -0.2px;
        }
        .ip-panel__subtitle {
          font-size: 12px; color: var(--c-text-3);
          margin-top: 3px;
        }

        /* ── Comparison rows ── */
        .ip-comparison-row {
          padding: 16px 0;
          border-bottom: 1px solid var(--c-border);
        }
        .ip-comparison-row:last-child { border-bottom: none; padding-bottom: 0; }
        .ip-comparison-row:first-child { padding-top: 0; }

        .ip-comparison-row__header {
          display: flex; align-items: center; gap: 8px;
          margin-bottom: 12px;
        }
        .ip-comparison-row__icon-wrap {
          width: 28px; height: 28px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .ip-comparison-row__label {
          font-size: 13px; font-weight: 600;
          color: var(--c-text-1); flex: 1;
        }
        .ip-comparison-row__badge {
          font-size: 11px; font-weight: 700;
          padding: 2px 8px; border-radius: 20px;
          letter-spacing: 0.02em;
        }
        .ip-comparison-row__bars { display: flex; flex-direction: column; gap: 8px; }

        .ip-comparison-bar-group__meta {
          display: flex; justify-content: space-between;
          align-items: center; margin-bottom: 5px;
        }
        .ip-comparison-bar-group__month { font-size: 11px; color: var(--c-text-3); }
        .ip-comparison-bar-group__amount {
          font-size: 12px; font-weight: 500;
          color: var(--c-text-2); font-variant-numeric: tabular-nums;
        }
        .ip-comparison-bar-group__amount--current {
          color: var(--c-text-1); font-weight: 700;
        }

        .ip-progress-track {
          height: 6px; border-radius: 99px;
          background: var(--c-bar-bg);
          overflow: hidden;
        }
        .ip-progress-fill {
          height: 100%; border-radius: 99px;
          transition: width 0.7s cubic-bezier(0.34,1.56,0.64,1);
        }

        /* ── Chart tooltip ── */
        .ip-chart-tooltip {
          background: var(--c-tooltip);
          border: 1px solid var(--c-border-hi);
          border-radius: 10px;
          padding: 10px 14px;
          box-shadow: var(--c-shadow-lg);
        }
        .ip-chart-tooltip__label {
          font-size: 11px; color: var(--c-text-3);
          font-weight: 500; margin-bottom: 2px;
        }
        .ip-chart-tooltip__value {
          font-size: 14px; font-weight: 700;
          font-variant-numeric: tabular-nums;
        }

        /* ── Observations grid ── */
        .ip-observations-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        @media (max-width: 1024px) { .ip-observations-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px)  { .ip-observations-grid { grid-template-columns: 1fr; } }

        /* ── Insight Card ── */
        .ip-insight-card {
          display: flex; gap: 14px;
          padding: 16px; border-radius: 14px;
          background: var(--c-bg);
          border: 1px solid var(--c-border);
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
          cursor: default;
        }
        .ip-insight-card:hover {
          border-color: var(--accent-border);
          box-shadow: var(--c-shadow-md);
          transform: translateY(-1px);
        }
        .ip-insight-card__icon-wrap {
          width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          margin-top: 1px;
        }
        .ip-insight-card__title {
          font-size: 13px; font-weight: 700;
          color: var(--c-text-1); margin-bottom: 6px;
        }
        .ip-insight-card__desc {
          font-size: 12px; line-height: 1.65;
          color: var(--c-text-2);
        }

        /* ── Divider ── */
        .ip-section-divider {
          display: flex; align-items: center; gap: 12px;
        }
        .ip-section-divider__line {
          flex: 1; height: 1px;
          background: var(--c-border);
        }
        .ip-section-divider__label {
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.07em; text-transform: uppercase;
          color: var(--c-text-3);
        }

        /* ── Animations ── */
        @keyframes ip-fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ip-animate-in {
          animation: ip-fadeSlideUp 0.45s both ease-out;
        }
      `}</style>

      <div className="ip-page">
        {/* ── Header ───────────────────────────── */}
        <div className="ip-page-header ip-animate-in" style={{ animationDelay: '0ms' }}>
          <span className="ip-page-header__eyebrow">
            <Sparkles size={12} />
            Financial Overview
          </span>
          <h1 className="ip-page-header__title">Spending Insights</h1>
          <p className="ip-page-header__subtitle">
            Smart analysis of your spending patterns for {currentMonthName}
          </p>
        </div>

        {/* ── KPI Stats ────────────────────────── */}
        <div className="ip-stat-grid">
          {stats.map((s, i) => (
            <StatCard key={s.label} {...s} index={i} />
          ))}
        </div>

        {/* ── Section Divider ──────────────────── */}
        <div className="ip-section-divider ip-animate-in" style={{ animationDelay: '200ms' }}>
          <div className="ip-section-divider__line" />
          <span className="ip-section-divider__label">Breakdown</span>
          <div className="ip-section-divider__line" />
        </div>

        {/* ── Charts Row ───────────────────────── */}
        <div className="ip-charts-row">
          {/* Monthly Comparison */}
          <div className="ip-panel ip-animate-in" style={{ animationDelay: '240ms' }}>
            <div className="ip-panel__header">
              <p className="ip-panel__title">Monthly Comparison</p>
              <p className="ip-panel__subtitle">{currentMonthName} vs {prevMonthName}</p>
            </div>
            <ComparisonRow
              label="Income"
              icon={ArrowUpRight}
              iconColor="#10b981"
              iconBg="rgba(16,185,129,0.1)"
              prevValue={insights.prevMonthIncome}
              currValue={insights.currentMonthIncome}
              prevLabel={prevMonthName}
              currLabel={currentMonthName}
              barColor="#10b981"
            />
            <ComparisonRow
              label="Expenses"
              icon={ArrowDownRight}
              iconColor="#ef4444"
              iconBg="rgba(239,68,68,0.1)"
              prevValue={insights.prevMonthExpenses}
              currValue={insights.currentMonthExpenses}
              prevLabel={prevMonthName}
              currLabel={currentMonthName}
              barColor="#ef4444"
            />
          </div>

          {/* Category Bar Chart */}
          <div className="ip-panel ip-animate-in" style={{ animationDelay: '280ms' }}>
            <div className="ip-panel__header">
              <p className="ip-panel__title">Top Spending Categories</p>
              <p className="ip-panel__subtitle">Expense distribution by category</p>
            </div>
            {categoryData.length > 0 ? (
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData}
                    margin={{ top: 4, right: 4, left: -18, bottom: 0 }}
                    barCategoryGap="32%"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke={isDark ? 'rgba(148,163,184,0.06)' : 'rgba(226,232,240,0.9)'}
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: isDark ? '#4a5168' : '#94a3b8', fontWeight: 500 }}
                      dy={6}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: isDark ? '#4a5168' : '#94a3b8', fontWeight: 400 }}
                      tickFormatter={v => `$${v}`}
                    />
                    <Tooltip
                      content={<CustomBarTooltip />}
                      cursor={{
                        fill: isDark ? 'rgba(148,163,184,0.05)' : 'rgba(0,0,0,0.025)',
                        radius: 6,
                      }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={38}>
                      {categoryData.map(entry => (
                        <Cell
                          key={entry.name}
                          fill={categoryColors[entry.name] || '#94a3b8'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontSize: 13, color: 'var(--c-text-3)' }}>No data available</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Section Divider ──────────────────── */}
        <div className="ip-section-divider ip-animate-in" style={{ animationDelay: '320ms' }}>
          <div className="ip-section-divider__line" />
          <span className="ip-section-divider__label">Observations</span>
          <div className="ip-section-divider__line" />
        </div>

        {/* ── Quick Observations ───────────────── */}
        <div className="ip-panel ip-animate-in" style={{ padding: '24px', animationDelay: '360ms' }}>
          <div className="ip-panel__header" style={{ marginBottom: 16 }}>
            <p className="ip-panel__title">Quick Observations</p>
            <p className="ip-panel__subtitle">AI-generated insights based on your data</p>
          </div>
          <div className="ip-observations-grid">
            <InsightCard
              icon={Zap}
              title="Savings Potential"
              color="#10b981"
              bgColor="rgba(16,185,129,0.1)"
              borderColor="rgba(16,185,129,0.35)"
              description={
                insights.savingsRate >= 30
                  ? "Excellent! You're saving over 30% of your income. Keep this healthy ratio going."
                  : insights.savingsRate >= 15
                  ? "Decent savings rate. Consider reducing your top expense to boost it further."
                  : "Savings rate is below 15%. Try trimming non-essential spending to improve it."
              }
            />
            <InsightCard
              icon={ShieldCheck}
              title="Spending Alert"
              color="#ef4444"
              bgColor="rgba(239,68,68,0.1)"
              borderColor="rgba(239,68,68,0.35)"
              description={
                `Highest expense: ${insights.highestCategory.name} at ${formatCurrency(insights.highestCategory.value)}.` +
                (insights.monthlyChange > 10
                  ? " Spending spiked significantly vs last month."
                  : insights.monthlyChange < -10
                  ? " Great - spending is down compared to last month."
                  : " Spending is relatively stable month-over-month.")
              }
            />
            <InsightCard
              icon={Activity}
              title="Activity Summary"
              color="#6366f1"
              bgColor="rgba(99,102,241,0.1)"
              borderColor="rgba(99,102,241,0.35)"
              description={
                `${insights.transactionCount} transactions logged with avg daily spend of ${formatCurrency(insights.avgDailyExpense)}.` +
                (insights.incomeCount > 0
                  ? ` ${insights.incomeCount} income source${insights.incomeCount > 1 ? 's' : ''} recorded.`
                  : '')
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}