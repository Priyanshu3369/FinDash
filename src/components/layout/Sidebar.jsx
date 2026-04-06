import { NavLink } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Lightbulb,
  PanelLeftClose,
  PanelLeftOpen,
  Wallet,
} from 'lucide-react';

const navItems = [
  { path: '/',              label: 'Dashboard',    icon: LayoutDashboard },
  { path: '/transactions',  label: 'Transactions', icon: ArrowLeftRight  },
  { path: '/insights',      label: 'Insights',     icon: Lightbulb       },
];

export default function Sidebar() {
  const { state, dispatch } = useApp();
  const { sidebarOpen } = state;

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="sb-overlay"
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
        />
      )}

      <aside className={`sb-root ${sidebarOpen ? 'sb-open' : 'sb-collapsed'}`}>

        {/* ── Brand ── */}
        <div className="sb-brand">
          <div className="sb-logo">
            <Wallet size={16} />
          </div>
          {sidebarOpen && (
            <span className="sb-wordmark">FinDash</span>
          )}
          <button
            className="sb-toggle sb-toggle-desktop"
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
          </button>
        </div>

        {/* ── Divider ── */}
        <div className="sb-rule" />

        {/* ── Nav label ── */}
        {sidebarOpen && <p className="sb-section-label">Navigation</p>}

        {/* ── Nav items ── */}
        <nav className="sb-nav">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              onClick={() => {
                if (window.innerWidth < 1024) dispatch({ type: 'TOGGLE_SIDEBAR' });
              }}
              className={({ isActive }) =>
                `sb-nav-item ${isActive ? 'sb-nav-active' : ''} ${!sidebarOpen ? 'sb-nav-icon-only' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active left-border indicator */}
                  {isActive && <span className="sb-active-bar" />}

                  <span className={`sb-nav-icon ${isActive ? 'sb-nav-icon-active' : ''}`}>
                    <Icon size={16} />
                  </span>

                  {sidebarOpen && (
                    <span className="sb-nav-label">{label}</span>
                  )}

                  {/* Tooltip when collapsed */}
                  {!sidebarOpen && (
                    <span className="sb-tooltip">{label}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── Spacer ── */}
        <div style={{ flex: 1 }} />

        {/* ── Divider ── */}
        <div className="sb-rule" />

        {/* ── User ── */}
        <div className={`sb-user ${!sidebarOpen ? 'sb-user-collapsed' : ''}`}>
          <div className="sb-avatar">JD</div>
          {sidebarOpen && (
            <div className="sb-user-info">
              <p className="sb-user-name">John Doe</p>
              <p className="sb-user-email">john@example.com</p>
            </div>
          )}
        </div>
      </aside>

      <style>{`
        /* Overlay */
        .sb-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 30;
        }
        @media (min-width: 1024px) { .sb-overlay { display: none; } }

        /* Root aside */
        .sb-root {
          position: fixed;
          top: 0; left: 0;
          height: 100%;
          z-index: 40;
          display: flex;
          flex-direction: column;
          background: var(--c-sidebar);
          border-right: 1px solid var(--c-border);
          font-family: var(--font-body);
          transition: width 0.28s cubic-bezier(0.16,1,0.3,1),
                      transform 0.28s cubic-bezier(0.16,1,0.3,1);
          overflow: hidden;
        }
        .sb-open     { width: var(--sb-w-open); transform: translateX(0); }
        .sb-collapsed{ width: var(--sb-w-closed); }

        @media (max-width: 1023px) {
          .sb-collapsed { transform: translateX(-100%); }
          .sb-open      { transform: translateX(0); width: var(--sb-w-open); }
        }

        /* Brand row */
        .sb-brand {
          display: flex;
          align-items: center;
          height: 60px;
          padding: 0 16px;
          gap: 10px;
          flex-shrink: 0;
        }
        .sb-logo {
          width: 32px; height: 32px;
          border-radius: 8px;
          border: 1px solid var(--c-border-hi);
          background: var(--c-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--c-accent);
          flex-shrink: 0;
        }
        .sb-wordmark {
          font-family: var(--font-display);
          font-size: 1.1rem;
          font-weight: 500;
          letter-spacing: -0.02em;
          color: var(--c-text-1);
          flex: 1;
          white-space: nowrap;
        }
        .sb-toggle {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--c-text-3);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px; height: 28px;
          border-radius: 6px;
          flex-shrink: 0;
          transition: color 0.15s, background 0.15s;
        }
        .sb-toggle:hover { color: var(--c-text-1); background: var(--c-hover-bg); }
        .sb-toggle-desktop { display: none; }
        @media (min-width: 1024px) { .sb-toggle-desktop { display: flex; } }

        /* Rule */
        .sb-rule {
          height: 1px;
          background: var(--c-border);
          flex-shrink: 0;
          margin: 0 16px;
        }

        /* Section label */
        .sb-section-label {
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--c-text-3);
          padding: 16px 20px 6px;
          flex-shrink: 0;
        }

        /* Nav */
        .sb-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 8px 8px 0;
          flex-shrink: 0;
        }
        .sb-nav-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 10px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 400;
          color: var(--c-text-2);
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
          overflow: hidden;
        }
        .sb-nav-item:hover {
          background: var(--c-hover-bg);
          color: var(--c-text-1);
        }
        .sb-nav-active {
          background: var(--c-active-bg) !important;
          color: var(--c-accent) !important;
        }
        .sb-nav-icon-only {
          justify-content: center;
          padding: 9px;
        }

        /* Active left bar */
        .sb-active-bar {
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%);
          width: 2px;
          height: 60%;
          background: var(--c-accent);
          border-radius: 0 2px 2px 0;
        }

        .sb-nav-icon { display: flex; align-items: center; flex-shrink: 0; }
        .sb-nav-icon-active { color: var(--c-accent); }
        .sb-nav-label { font-size: 13px; font-weight: 400; }

        /* Collapsed tooltip */
        .sb-tooltip {
          position: absolute;
          left: calc(var(--sb-w-closed) + 8px);
          top: 50%;
          transform: translateY(-50%);
          background: var(--c-surface);
          border: 1px solid var(--c-border-hi);
          color: var(--c-text-1);
          font-size: 12px;
          font-weight: 500;
          padding: 5px 10px;
          border-radius: 6px;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s;
          z-index: 50;
          box-shadow: var(--c-shadow-md);
        }
        .sb-nav-item:hover .sb-tooltip { opacity: 1; }

        /* User row */
        .sb-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          flex-shrink: 0;
        }
        .sb-user-collapsed { justify-content: center; padding: 14px 8px; }
        .sb-avatar {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: rgba(99, 102, 241, 0.12);
          border: 1px solid rgba(99, 102, 241, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
          color: var(--c-accent);
          flex-shrink: 0;
          letter-spacing: 0.03em;
        }
        .sb-user-info { min-width: 0; }
        .sb-user-name {
          font-size: 12.5px;
          font-weight: 500;
          color: var(--c-text-1);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sb-user-email {
          font-size: 11px;
          color: var(--c-text-3);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 1px;
        }
      `}</style>
    </>
  );
}