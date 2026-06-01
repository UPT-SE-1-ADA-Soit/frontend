import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';

import { LoginRequired } from '@/components/LoginRequired.jsx';
import { useAuth } from '@/context/auth.jsx';

import { MOCK_CONVERSATIONS } from '@/mocks/messages.js';
import { MOCK_USERS } from '@/mocks/users.js';
import { MOCK_PRODUCTS } from '@/mocks/products.js';

import styles from './Chat.module.css';

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function findConversation(meId, otherId) {
  return (
    MOCK_CONVERSATIONS.find(
      (c) =>
        (c.buyer.id === meId && c.seller.id === otherId) ||
        (c.seller.id === meId && c.buyer.id === otherId),
    ) ?? null
  );
}

export default function Chat() {
  const { id: otherUserId } = useParams();
  const [params] = useSearchParams();
  const productId = params.get('productId');
  const navigate = useNavigate();
  const { user } = useAuth();
  const listRef = useRef(null);

  const otherUser = useMemo(
    () => MOCK_USERS.find((u) => u.id === otherUserId),
    [otherUserId],
  );

  const seedConversation = useMemo(
    () => (user ? findConversation(user.id, otherUserId) : null),
    [user, otherUserId],
  );

  const product = useMemo(() => {
    if (productId) return MOCK_PRODUCTS.find((p) => p.id === productId);
    return seedConversation?.product;
  }, [productId, seedConversation]);

  const [messages, setMessages] = useState(() => seedConversation?.messages ?? []);
  const [input, setInput] = useState('');

  useEffect(() => {
    setMessages(seedConversation?.messages ?? []);
  }, [seedConversation]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  if (!user) return <LoginRequired message="Log in to view your conversations." />;

  if (!otherUser) {
    return (
      <div className={styles.notFound}>
        <p>Conversation not found.</p>
        <button
          type="button"
          className={styles.backLink}
          onClick={() => navigate('/messages')}
        >
          ← Go back
        </button>
      </div>
    );
  }

  function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const msg = {
      id: `local-${Date.now()}`,
      senderId: user.id,
      text,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [...prev, msg]);
    setInput('');
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate('/messages')}
          aria-label="Back to messages"
        >
          <ArrowLeft size={22} />
        </button>

        {otherUser.avatar ? (
          <img
            src={otherUser.avatar}
            alt={otherUser.name}
            className={styles.avatar}
          />
        ) : (
          <div className={`${styles.avatar} ${styles.avatarFallback}`}>
            {otherUser.name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className={styles.headerInfo}>
          <p className={styles.headerName}>{otherUser.name}</p>
          {product && (
            <p className={styles.headerProduct}>
              {product.title} · ${product.price}
            </p>
          )}
        </div>

        {product && product.images[0] && (
          <img
            src={product.images[0]}
            alt={product.title}
            className={styles.headerThumbnail}
          />
        )}
      </header>

      <div className={styles.messageList} ref={listRef}>
        {messages.length === 0 ? (
          <div className={styles.emptyChat}>
            <p>Say hello to {otherUser.name}!</p>
          </div>
        ) : (
          messages.map((m) => {
            const isSent = m.senderId === user.id;
            return (
              <div
                key={m.id}
                className={`${styles.bubbleRow} ${isSent ? styles.bubbleRowSent : ''}`}
              >
                <div
                  className={`${styles.bubble} ${
                    isSent ? styles.bubbleSent : styles.bubbleReceived
                  }`}
                >
                  <p className={styles.bubbleText}>{m.text}</p>
                  <span
                    className={`${styles.bubbleTime} ${isSent ? styles.bubbleTimeSent : ''}`}
                  >
                    {formatTime(m.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form className={styles.inputBar} onSubmit={handleSend}>
        <input
          type="text"
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          maxLength={500}
        />
        <button
          type="submit"
          className={styles.sendBtn}
          disabled={!input.trim()}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
