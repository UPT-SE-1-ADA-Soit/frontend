import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';

import { LoginRequired } from '@/components/LoginRequired.jsx';
import { useAuth } from '@/context/auth.jsx';
import { useConversation } from '@/hooks/useConversation.js';
import { fetchProductDetail } from '@/services/productService.js';

import styles from './Chat.module.css';

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Chat() {
  const { id: otherUserParam } = useParams();
  const [params] = useSearchParams();
  const productId = params.get('productId');
  const navigate = useNavigate();
  const { user } = useAuth();
  const listRef = useRef(null);

  const otherUserId = otherUserParam ? Number(otherUserParam) : null;
  const { messages, otherUser, loading, error, sending, send } = useConversation(
    user?.id,
    otherUserId,
  );

  const [product, setProduct] = useState(null);
  useEffect(() => {
    if (!productId) {
      setProduct(null);
      return;
    }
    let cancelled = false;
    fetchProductDetail(productId)
      .then((p) => {
        if (!cancelled) setProduct(p);
      })
      .catch(() => {
        if (!cancelled) setProduct(null);
      });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const [input, setInput] = useState('');

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  if (!user) return <LoginRequired message="Log in to view your conversations." />;

  if (!otherUserId) {
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

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setInput('');
    try {
      await send(text);
    } catch {
      setInput(text);
    }
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

        {otherUser?.avatar ? (
          <img
            src={otherUser.avatar}
            alt={otherUser.name}
            className={styles.avatar}
          />
        ) : (
          <div className={`${styles.avatar} ${styles.avatarFallback}`}>
            {(otherUser?.name ?? '?').charAt(0).toUpperCase()}
          </div>
        )}

        <div className={styles.headerInfo}>
          <p className={styles.headerName}>
            {otherUser?.name ?? `User #${otherUserId}`}
          </p>
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
        {loading ? (
          <div className={styles.emptyChat}>
            <p>Loading…</p>
          </div>
        ) : error ? (
          <div className={styles.emptyChat}>
            <p>Couldn’t load messages: {error.message}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className={styles.emptyChat}>
            <p>Say hello to {otherUser?.name ?? 'them'}!</p>
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
                  <p className={styles.bubbleText}>{m.content}</p>
                  <span
                    className={`${styles.bubbleTime} ${isSent ? styles.bubbleTimeSent : ''}`}
                  >
                    {formatTime(m.sentAt)}
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
          disabled={sending}
        />
        <button
          type="submit"
          className={styles.sendBtn}
          disabled={!input.trim() || sending}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
