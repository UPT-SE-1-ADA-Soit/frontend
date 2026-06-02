import { useEffect, useState } from 'react';

import { fetchConversations } from '@/services/messageService.js';
import { fetchUserProfile } from '@/services/userService.js';

export function useConversations(currentUserId) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUserId) {
      setConversations([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchConversations()
      .then(async (summaries) => {
        const enriched = await Promise.all(
          summaries.map(async (s) => {
            let otherUser;
            try {
              otherUser = await fetchUserProfile(s.otherUserId);
            } catch {
              otherUser = {
                id: s.otherUserId,
                name: `User #${s.otherUserId}`,
                location: '',
                avatar: null,
              };
            }
            return { ...s, otherUser };
          }),
        );
        if (!cancelled) setConversations(enriched);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentUserId]);

  return { conversations, loading, error };
}
