import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

import { CategoryPill } from '@/components/CategoryPill.jsx';
import { ProductCard } from '@/components/ProductCard.jsx';
import { SearchBar } from '@/components/SearchBar.jsx';

import { useAuth } from '@/context/auth.jsx';
import { useCategories } from '@/hooks/useCategories.js';
import { useProducts } from '@/hooks/useProducts.js';

import styles from './Home.module.css';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [query, setQuery] = useState('');

  const { products, loading, error } = useProducts();
  const { categories } = useCategories();

  const visibleProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery = !q || p.title.toLowerCase().includes(q);
      const matchesCategory =
        !selectedCategory || p.categoryId === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, selectedCategory]);

  return (
    <div className={styles.page}>
      <div className={styles.greeting}>
        <div>
          <p className={styles.greetingHello}>
            Hi, {user?.name.split(' ')[0]} 👋
          </p>
          {user?.location ? (
            <p className={styles.location}>
              <MapPin size={14} /> {user.location}
            </p>
          ) : (
            <p className={styles.location}>
              <MapPin size={14} /> Nearby
            </p>
          )}
        </div>
      </div>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search for items..."
      />

      <div className={styles.categoryRow}>
        {categories.map((cat) => (
          <CategoryPill
            key={cat.id}
            category={cat}
            selected={selectedCategory === cat.id}
            onClick={() =>
              setSelectedCategory((prev) => (prev === cat.id ? null : cat.id))
            }
          />
        ))}
      </div>

      <h2 className={styles.sectionTitle}>
        {selectedCategory || query.trim()
          ? `${visibleProducts.length} results`
          : 'Recommended for you'}
      </h2>

      {loading ? (
        <div className={styles.empty}>
          <p>Loading items…</p>
        </div>
      ) : error ? (
        <div className={styles.empty}>
          <p>Couldn’t load items: {error.message}</p>
        </div>
      ) : visibleProducts.length === 0 ? (
        <div className={styles.empty}>
          <p>No items in this category yet.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {visibleProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onClick={() => navigate(`/product/${p.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
