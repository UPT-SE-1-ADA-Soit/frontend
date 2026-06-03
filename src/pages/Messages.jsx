import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

import { ConversationCard } from '@/components/ConversationCard.jsx';
import { LoginRequired } from '@/components/LoginRequired.jsx';
import { useAuth } from '@/context/auth.jsx';
import { useMessaging } from '@/context/messaging.jsx';

import styles from './Messages.module.css';

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { conversations, loading, error, totalUnread } = useMessaging();

  if (!user) return <LoginRequired message="Log in to view your conversations." />;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Messages</h1>
        {totalUnread > 0 && (
          <span className={styles.unreadBadge}>{totalUnread}</span>
        )}
      </header>

      {loading ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Loading conversations…</p>
        </div>
      ) : error ? (
        <div className={styles.empty}>
          <h2 className={styles.emptyTitle}>Couldn’t load conversations</h2>
          <p className={styles.emptyText}>{error.message}</p>
        </div>
      ) : conversations.length === 0 ? (
        <div className={styles.empty}>
          <MessageSquare size={48} color="#d1d5db" />
          <h2 className={styles.emptyTitle}>No conversations yet</h2>
          <p className={styles.emptyText}>
            Find something you like and send a message to the seller.
          </p>
        </div>
      ) : (
        <ul className={styles.list}>
          {conversations.map((c) => (
            <li key={c.otherUserId}>
              <ConversationCard
                conversation={c}
                onClick={() => navigate(`/chat/${c.otherUserId}`)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
