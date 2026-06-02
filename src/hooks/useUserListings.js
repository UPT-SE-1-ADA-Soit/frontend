import { useEffect, useState } from 'react';

import { fetchUserListings } from '@/services/userService.js';

export function useUserListings(userId) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId === undefined || userId === null) {
      setListings([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchUserListings(userId)
      .then((data) => {
        if (!cancelled) setListings(data);
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
  }, [userId]);

  return { listings, loading, error };
}
