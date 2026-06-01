import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth.jsx';
import { MOCK_PRODUCTS } from '@/mocks/products.js';

const LikesContext = createContext(null);

function storageKey(userId) {
  return `marketa.likes.${userId}`;
}

export function LikesProvider({ children }) {
  const { user } = useAuth();
  const [likedIds, setLikedIds] = useState(new Set());

  useEffect(() => {
    if (!user) {
      setLikedIds(new Set());
      return;
    }
    try {
      const raw = localStorage.getItem(storageKey(user.id));
      if (raw) {
        setLikedIds(new Set(JSON.parse(raw)));
        return;
      }
    } catch {
      // ignore
    }
    // Seed from mock "isLiked" flag the first time
    const seeded = new Set(
      MOCK_PRODUCTS.filter((p) => p.isLiked).map((p) => p.id),
    );
    setLikedIds(seeded);
  }, [user?.id]);

  function persist(next) {
    if (!user) return;
    localStorage.setItem(storageKey(user.id), JSON.stringify([...next]));
  }

  function toggleLike(productId) {
    if (!user) return;
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      persist(next);
      return next;
    });
  }

  function isLiked(productId) {
    return likedIds.has(productId);
  }

  return (
    <LikesContext.Provider value={{ toggleLike, isLiked, likedIds }}>
      {children}
    </LikesContext.Provider>
  );
}

export function useLikes() {
  const ctx = useContext(LikesContext);
  if (!ctx) throw new Error('useLikes must be used within LikesProvider');
  return ctx;
}
