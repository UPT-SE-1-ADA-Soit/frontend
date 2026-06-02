import { useEffect, useState } from 'react';

import { fetchProductDetail } from '@/services/productService.js';
import { fetchUserProfile } from '@/services/userService.js';

export function useProductDetail(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id === undefined || id === null) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchProductDetail(id)
      .then(async (p) => {
        let seller = null;
        try {
          seller = await fetchUserProfile(p.sellerId);
        } catch {
          seller = { id: p.sellerId, name: `User #${p.sellerId}`, location: '', avatar: null };
        }
        if (cancelled) return;
        setProduct({ ...p, seller });
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { product, loading, error };
}
