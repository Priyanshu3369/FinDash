import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sun, Moon, Menu, Shield, Eye, Bell } from 'lucide-react';

const mockNotifications = [
  { id: 1, title: 'Security Alert', message: 'New login detected from Chrome on Windows.', time: '2 mins ago', unread: true },
  { id: 2, title: 'Payment Success', message: 'You successfully paid $120.00 for your Internet Bill.', time: '1 hour ago', unread: true },
  { id: 3, title: 'Budget Warning', message: 'You have used 85% of your Food budget this month.', time: '3 hours ago', unread: false },
  { id: 4, title: 'Weekly Report', message: 'Your weekly financial summary is ready to view.', time: '1 day ago', unread: false },
];

export default function Navbar() {
  const { state, dispatch } = useApp();
  const { role, darkMode } = state;
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    if (showNotif) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotif]);

  return (
    <>
      <header className="nb-root">
        {/* ── Left ── */}
        <div className="nb-left">
          {/* Mobile hamburger */}
          <button
            className="nb-icon-btn nb-hamburger"
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
            aria-label="Toggle menu"
          >
            <Menu size={17} />
          </button>

          {/* Breadcrumb-style page label */}
          <div className="nb-breadcrumb">
            <span className="nb-breadcrumb-app">FinDash</span>
            <span className="nb-breadcrumb-sep">/</span>
            <span className="nb-breadcrumb-page">
              {role === 'admin' ? 'Admin' : 'Viewer'}
            </span>
          </div>
        </div>

        {/* ── Right ── */}
        <div className="nb-right">

          {/* Role switcher */}
          <div className="nb-role-switcher" role="group" aria-label="Switch role">
            <button
              className={`nb-role-btn ${role === 'viewer' ? 'nb-role-active' : ''}`}
              onClick={() => dispatch({ type: 'SET_ROLE', payload: 'viewer' })}
            >
              <Eye size={12} />
              <span>Viewer</span>
            </button>
            <button
              className={`nb-role-btn ${role === 'admin' ? 'nb-role-active' : ''}`}
              onClick={() => dispatch({ type: 'SET_ROLE', payload: 'admin' })}
            >
              <Shield size={12} />
              <span>Admin</span>
            </button>
          </div>

          {/* Divider */}
          <div className="nb-vr" />

          {/* Notifications */}
          <div className="nb-notif-wrapper" ref={notifRef}>
            <button
              className="nb-icon-btn nb-notif"
              aria-label="Notifications"
              onClick={() => setShowNotif(!showNotif)}
            >
              <Bell size={15} />
              <span className="nb-notif-dot" />
            </button>

            {showNotif && (
              <div className="nb-notif-dropdown">
                <div className="nb-notif-header">
                  <h4>Notifications</h4>
                  <button className="nb-notif-mark-read">Mark all as read</button>
                </div>
                <div className="nb-notif-list">
                  {mockNotifications.map((n) => (
                    <div key={n.id} className={`nb-notif-item ${n.unread ? 'nb-notif-unread' : ''}`}>
                      <div className="nb-notif-content">
                        <p className="nb-notif-title">{n.title}</p>
                        <p className="nb-notif-msg">{n.message}</p>
                        <p className="nb-notif-time">{n.time}</p>
                      </div>
                      {n.unread && <span className="nb-notif-indicator" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dark mode */}
          <button
            className="nb-icon-btn"
            onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </header>

      <style>{`
        .nb-root {
          position: sticky;
          top: 0;
          z-index: 20;
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.75rem;
          background: var(--c-bg);
          border-bottom: 1px solid var(--c-border);
          font-family: var(--font-body);
        }

        /* Left */
        .nb-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .nb-hamburger {
          display: flex;
        }
        @media (min-width: 1024px) { .nb-hamburger { display: none; } }

        .nb-breadcrumb {
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .nb-breadcrumb-app {
          font-size: 12px;
          font-weight: 400;
          color: var(--c-text-3);
          letter-spacing: 0.02em;
        }
        .nb-breadcrumb-sep {
          font-size: 12px;
          color: var(--c-text-3);
        }
        .nb-breadcrumb-page {
          font-size: 12px;
          font-weight: 500;
          color: var(--c-text-2);
          letter-spacing: 0.02em;
        }

        /* Right */
        .nb-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Icon button base */
        .nb-icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--c-text-2);
          width: 32px; height: 32px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s, color 0.15s;
          flex-shrink: 0;
          position: relative;
        }
        .nb-icon-btn:hover {
          background: var(--c-hover-bg);
          color: var(--c-text-1);
        }

        /* Notification wrapper & dot */
        .nb-notif-wrapper {
          position: relative;
        }
        .nb-notif-dot {
          position: absolute;
          top: 7px; right: 7px;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--c-accent);
          border: 1.5px solid var(--c-bg);
        }

        /* ── Notifications Dropdown ── */
        .nb-notif-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: -40px;
          width: 330px;
          background: var(--c-surface);
          border: 1px solid var(--c-border-hi);
          border-radius: 12px;
          box-shadow: var(--c-shadow-xl);
          z-index: 50;
          font-family: var(--font-body);
          animation: nb-drop-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }
        @media (min-width: 480px) {
          .nb-notif-dropdown { right: -10px; }
        }
        @keyframes nb-drop-in {
          from { opacity: 0; transform: translateY(-8px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        .nb-notif-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid var(--c-border);
          background: var(--c-bg);
        }
        .nb-notif-header h4 {
          margin: 0;
          font-size: 13px;
          font-weight: 600;
          color: var(--c-text-1);
        }
        .nb-notif-mark-read {
          background: none;
          border: none;
          font-size: 11px;
          padding: 0;
          color: var(--c-accent);
          font-weight: 500;
          cursor: pointer;
        }
        .nb-notif-mark-read:hover { text-decoration: underline; }

        .nb-notif-list {
          display: flex;
          flex-direction: column;
          max-height: 400px;
          overflow-y: auto;
        }
        .nb-notif-item {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid var(--c-border);
          transition: background 0.15s;
          cursor: pointer;
        }
        .nb-notif-item:last-child { border-bottom: none; }
        .nb-notif-item:hover { background: var(--c-hover-bg); }
        .nb-notif-unread { background: rgba(99, 102, 241, 0.04); }
        .dark .nb-notif-unread { background: rgba(129, 140, 248, 0.04); }
        
        .nb-notif-content { flex: 1; }
        .nb-notif-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--c-text-1);
          margin: 0 0 4px 0;
        }
        .nb-notif-msg {
          font-size: 12px;
          color: var(--c-text-2);
          margin: 0 0 6px 0;
          line-height: 1.4;
        }
        .nb-notif-time {
          font-size: 10.5px;
          color: var(--c-text-3);
          font-weight: 500;
          margin: 0;
        }
        .nb-notif-indicator {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--c-accent);
          margin-top: 4px;
          flex-shrink: 0;
          box-shadow: 0 0 0 2px var(--c-surface);
        }

        /* Vertical rule */
        .nb-vr {
          width: 1px;
          height: 18px;
          background: var(--c-border);
          margin: 0 4px;
        }

        /* Role switcher */
        .nb-role-switcher {
          display: flex;
          align-items: center;
          background: var(--c-bg);
          border: 1px solid var(--c-border);
          border-radius: 7px;
          padding: 2px;
          gap: 1px;
        }
        .nb-role-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          border-radius: 5px;
          border: none;
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 11.5px;
          font-weight: 500;
          color: var(--c-text-3);
          background: none;
          transition: background 0.15s, color 0.15s;
          white-space: nowrap;
        }
        .nb-role-btn:hover {
          color: var(--c-text-2);
          background: var(--c-hover-bg);
        }
        .nb-role-active {
          background: var(--c-surface) !important;
          color: var(--c-text-1) !important;
          border: 1px solid var(--c-border-hi);
          box-shadow: var(--c-shadow-xs);
        }

        /* Responsive */
        @media (max-width: 480px) {
          .nb-role-btn span { display: none; }
          .nb-role-btn { padding: 5px 7px; }
          .nb-breadcrumb-app, .nb-breadcrumb-sep { display: none; }
          .nb-root { padding: 0 1rem; }
        }
      `}</style>
    </>
  );
}