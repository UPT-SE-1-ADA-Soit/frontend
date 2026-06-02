import { createContext, useContext, useEffect, useState } from 'react';

import {
  addFavorite,
  fetchUserFavorites,
  removeFavorite,
} from '@/services/userService.js';
import { useAuth } from './auth.jsx';

const LikesContext = createContext(null);

export function LikesProvider({ children }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [likedIds, setLikedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      setLikedIds(new Set());
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchUserFavorites(user.id)
      .then((list) => {
        if (cancelled) return;
        setFavorites(list);
        setLikedIds(new Set(list.map((p) => p.id)));
      })
      .catch(() => {
        if (cancelled) return;
        setFavorites([]);
        setLikedIds(new Set());
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  async function toggleLike(productId) {
    if (!user) return;
    const wasLiked = likedIds.has(productId);

    setLikedIds((prev) => {
      const next = new Set(prev);
      if (wasLiked) next.delete(productId);
      else next.add(productId);
      return next;
    });

    try {
      if (wasLiked) await removeFavorite(user.id, productId);
      else await addFavorite(user.id, productId);
      const fresh = await fetchUserFavorites(user.id);
      setFavorites(fresh);
      setLikedIds(new Set(fresh.map((p) => p.id)));
    } catch {
      setLikedIds((prev) => {
        const next = new Set(prev);
        if (wasLiked) next.add(productId);
        else next.delete(productId);
        return next;
      });
    }
  }

  function isLiked(productId) {
    return likedIds.has(productId);
  }

  return (
    <LikesContext.Provider
      value={{ favorites, likedIds, isLiked, toggleLike, loading }}
    >
      {children}
    </LikesContext.Provider>
  );
}

export function useLikes() {
  const ctx = useContext(LikesContext);
  if (!ctx) throw new Error('useLikes must be used within LikesProvider');
  return ctx;
}
