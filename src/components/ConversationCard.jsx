import styles from './ConversationCard.module.css';

function formatTime(iso) {
  const date = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
  if (diffDays === 0)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'short' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function initials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function ConversationCard({ conversation, onClick }) {
  const { otherUser, lastMessage, lastMessageAt, unreadCount } = conversation;
  const isUnread = unreadCount > 0;

  return (
    <button
      type="button"
      className={`${styles.container} ${isUnread ? styles.containerUnread : ''}`}
      onClick={onClick}
    >
      {isUnread && <span className={styles.unreadBar} />}

      {otherUser.avatar ? (
        <img
          src={otherUser.avatar}
          alt={otherUser.name}
          className={styles.avatar}
        />
      ) : (
        <div className={`${styles.avatar} ${styles.avatarFallback}`}>
          {initials(otherUser.name)}
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.topRow}>
          <span className={`${styles.name} ${isUnread ? styles.nameBold : ''}`}>
            {otherUser.name}
          </span>
          <span className={styles.time}>{formatTime(lastMessageAt)}</span>
        </div>
        <div className={styles.bottomRow}>
          <span
            className={`${styles.lastMessage} ${isUnread ? styles.lastMessageBold : ''}`}
          >
            {lastMessage}
          </span>
          {isUnread && <span className={styles.badge}>{unreadCount}</span>}
        </div>
      </div>
    </button>
  );
}
