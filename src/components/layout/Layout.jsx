import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useApp } from '../../context/AppContext';
import { useState, useEffect } from 'react';

export default function Layout() {
  const { state } = useApp();
  const { sidebarOpen } = state;
  const [isLg, setIsLg] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const onResize = () => setIsLg(window.innerWidth >= 1024);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const sidebarW = isLg ? (sidebarOpen ? '240px' : '64px') : '0px';

  return (
    <>
      <div className="ly-root">
        <Sidebar />

        <div
          className="ly-body"
          style={{
            marginLeft: sidebarW,
            transition: 'margin-left 0.28s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <Navbar />

          <main className="ly-main">
            <Outlet />
          </main>
        </div>
      </div>

      <style>{`
        .ly-root {
          min-height: 100vh;
          background: var(--c-bg);
          font-family: var(--font-body);
        }

        .ly-body {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .ly-main {
          flex: 1;
          padding: 2rem 2.5rem 4rem;
          max-width: 1320px;
          width: 100%;
        }

        @media (max-width: 1024px) {
          .ly-main { padding: 1.75rem 1.75rem 3rem; }
        }
        @media (max-width: 768px) {
          .ly-main { padding: 1.25rem 1rem 3rem; }
        }
      `}</style>
    </>
  );
}