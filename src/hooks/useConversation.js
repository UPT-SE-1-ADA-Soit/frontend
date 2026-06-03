import { useCallback, useEffect, useRef, useState } from 'react';

import {
  fetchConversation,
  markRead,
  sendMessage,
} from '@/services/messageService.js';
import { fetchUserProfile } from '@/services/userService.js';

export function useConversation(currentUserId, otherUserId) {
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!currentUserId || !otherUserId) return;
    let cancelled = false;
    loadedRef.current = false;
    setLoading(true);
    setError(null);

    Promise.all([
      fetchConversation(otherUserId),
      fetchUserProfile(otherUserId).catch(() => ({
        id: otherUserId,
        name: `User #${otherUserId}`,
        location: '',
        avatar: null,
      })),
    ])
      .then(([conv, user]) => {
        if (cancelled) return;
        const chronological = [...conv.messages].sort(
          (a, b) => new Date(a.sentAt) - new Date(b.sentAt),
        );
        setMessages(chronological);
        setOtherUser(user);

        const unreadIncoming = chronological.filter(
          (m) => m.receiverId === currentUserId && m.readAt === null,
        );
        if (unreadIncoming.length === 0) return;
        const now = new Date().toISOString();
        setMessages((prev) =>
          prev.map((m) =>
            unreadIncoming.some((u) => u.id === m.id)
              ? { ...m, readAt: now }
              : m,
          ),
        );
        unreadIncoming.forEach((m) => {
          markRead(m.id).catch(() => {});
        });
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
          loadedRef.current = true;
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentUserId, otherUserId]);

  useEffect(() => {
    if (!currentUserId || !otherUserId) return;

    const id = setInterval(async () => {
      if (!loadedRef.current) return;
      try {
        const conv = await fetchConversation(otherUserId, { page: 0, size: 20 });
        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const fresh = conv.messages.filter((m) => !existingIds.has(m.id));
          if (fresh.length === 0) return prev;

          const incomingNew = fresh.filter(
            (m) => m.receiverId === currentUserId && m.readAt === null,
          );
          const now = new Date().toISOString();
          incomingNew.forEach((m) => markRead(m.id).catch(() => {}));

          return [
            ...prev,
            ...fresh.map((m) =>
              incomingNew.some((u) => u.id === m.id) ? { ...m, readAt: now } : m,
            ),
          ].sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
        });
      } catch {
        // ignore poll errors
      }
    }, 3000);

    return () => clearInterval(id);
  }, [currentUserId, otherUserId]);

  const send = useCallback(
    async (content) => {
      if (!otherUserId || !content.trim()) return;
      setSending(true);
      try {
        const msg = await sendMessage(otherUserId, content.trim());
        setMessages((prev) => [...prev, msg]);
      } finally {
        setSending(false);
      }
    },
    [otherUserId],
  );

  return { messages, otherUser, loading, error, sending, send };
}
