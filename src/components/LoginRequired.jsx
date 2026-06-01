import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import styles from './LoginRequired.module.css';

export function LoginRequired({ message = 'You need to log in to continue.' }) {
  const navigate = useNavigate();
  return (
    <div className={styles.wrap}>
      <div className={styles.iconBubble}>
        <Lock size={28} strokeWidth={2} />
      </div>
      <h2 className={styles.title}>Sign in to continue</h2>
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primary}
          onClick={() => navigate('/login')}
        >
          Log in
        </button>
        <button
          type="button"
          className={styles.secondary}
          onClick={() => navigate('/register')}
        >
          Create account
        </button>
      </div>
    </div>
  );
}
