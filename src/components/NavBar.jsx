import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Search,
  PlusCircle,
  MessageSquare,
  User as UserIcon,
} from 'lucide-react';

import { useAuth } from '@/context/auth.jsx';
import styles from './NavBar.module.css';

const TABS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/sell', label: 'Sell', icon: PlusCircle, primary: true },
  { to: '/messages', label: 'Messages', icon: MessageSquare },
  { to: '/profile', label: 'Profile', icon: UserIcon },
];

export function NavBar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label="Marketa home">
          <span className={styles.brandIcon}>M</span>
          <span className={styles.brandName}>Marketa</span>
        </Link>

        <nav className={styles.tabs}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  [
                    styles.tab,
                    tab.primary ? styles.tabPrimary : '',
                    isActive ? styles.tabActive : '',
                  ]
                    .filter(Boolean)
                    .join(' ')
                }
              >
                <Icon size={18} strokeWidth={2} />
                <span className={styles.tabLabel}>{tab.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className={styles.authArea}>
          {user ? (
            <Link to="/profile" className={styles.userChip}>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className={styles.userAvatar}
                />
              ) : (
                <span className={styles.userAvatarFallback}>
                  {user.name.charAt(0).toUpperCase()}
                </span>
              )}
              <span className={styles.userName}>
                {user.name.split(' ')[0]}
              </span>
            </Link>
          ) : (
            <div className={styles.authButtons}>
              <button
                type="button"
                className={styles.btnOutline}
                onClick={() => navigate('/login')}
              >
                Log in
              </button>
              <button
                type="button"
                className={styles.btnPrimary}
                onClick={() => navigate('/register')}
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
