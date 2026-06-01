import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

import { ConversationCard } from '@/components/ConversationCard.jsx';
import { LoginRequired } from '@/components/LoginRequired.jsx';
import { useAuth } from '@/context/auth.jsx';
import { MOCK_CONVERSATIONS } from '@/mocks/messages.js';

import styles from './Messages.module.css';

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const conversations = useMemo(() => {
    if (!user) return [];
    return MOCK_CONVERSATIONS.map((c) => {
      const otherUser = c.buyer.id === user.id ? c.seller : c.buyer;
      return {
        id: c.id,
        otherUserId: otherUser.id,
        otherUser,
        lastMessage: c.lastMessage.text,
        lastMessageAt: c.lastMessage.createdAt,
        unreadCount: c.unreadCount,
      };
    });
  }, [user]);

  if (!user) return <LoginRequired message="Log in to view your conversations." />;

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Messages</h1>
        {totalUnread > 0 && (
          <span className={styles.unreadBadge}>{totalUnread}</span>
        )}
      </header>

      {conversations.length === 0 ? (
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
            <li key={c.id}>
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
