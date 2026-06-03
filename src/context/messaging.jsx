import { createContext, useContext, useEffect, useRef, useState } from 'react';

import { fetchConversations } from '@/services/messageService.js';
import { fetchUserProfile } from '@/services/userService.js';
import { useAuth } from '@/context/auth.jsx';

const MessagingContext = createContext(null);

export function MessagingProvider({ children }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const profileCache = useRef({});

  useEffect(() => {
    if (!user?.id) {
      setConversations([]);
      profileCache.current = {};
      return;
    }

    async function refresh(isInitial) {
      if (isInitial) {
        setLoading(true);
        setError(null);
      }
      try {
        const summaries = await fetchConversations();
        const enriched = await Promise.all(
          summaries.map(async (s) => {
            if (!profileCache.current[s.otherUserId]) {
              try {
                profileCache.current[s.otherUserId] = await fetchUserProfile(s.otherUserId);
              } catch {
                profileCache.current[s.otherUserId] = {
                  id: s.otherUserId,
                  name: `User #${s.otherUserId}`,
                  location: '',
                  avatar: null,
                };
              }
            }
            return { ...s, otherUser: profileCache.current[s.otherUserId] };
          }),
        );
        setConversations(enriched);
      } catch (err) {
        if (isInitial) setError(err);
      } finally {
        if (isInitial) setLoading(false);
      }
    }

    refresh(true);
    const id = setInterval(() => refresh(false), 5000);
    return () => clearInterval(id);
  }, [user?.id]);

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount ?? 0), 0);

  return (
    <MessagingContext.Provider value={{ conversations, loading, error, totalUnread }}>
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessaging() {
  return useContext(MessagingContext);
}
