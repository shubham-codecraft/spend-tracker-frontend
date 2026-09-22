import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/expenses/new', label: 'Add expense' },
  { to: '/expenses', label: 'All expenses' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="shell">
      <aside className="sidebar">
        <div>
          <div className="brand">
            <span className="brand__mark">Ledger</span>
            <span className="brand__tag">Spend Tracker</span>
          </div>
          <nav className="nav">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => `nav__link${isActive ? ' is-active' : ''}`}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar__footer">
          <div className="identity">
            <span className="identity__name">
              {user?.first_name} {user?.last_name}
            </span>
            <span className="identity__email">{user?.email}</span>
          </div>
          <button className="text-link" onClick={logout}>
            Log out
          </button>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>

      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
