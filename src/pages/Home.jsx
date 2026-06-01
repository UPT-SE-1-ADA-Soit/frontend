import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

import { CategoryPill } from '@/components/CategoryPill.jsx';
import { ProductCard } from '@/components/ProductCard.jsx';
import { SearchBar } from '@/components/SearchBar.jsx';

import { useAuth } from '@/context/auth.jsx';
import { MOCK_CATEGORIES } from '@/mocks/categories.js';
import { MOCK_PRODUCTS } from '@/mocks/products.js';

import styles from './Home.module.css';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [query, setQuery] = useState('');

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_PRODUCTS.filter((p) => {
      const matchesQuery = !q || p.title.toLowerCase().includes(q);
      const matchesCategory =
        !selectedCategory || p.category.id === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [query, selectedCategory]);

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
        {MOCK_CATEGORIES.map((cat) => (
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
          ? `${products.length} results`
          : 'Recommended for you'}
      </h2>

      {products.length === 0 ? (
        <div className={styles.empty}>
          <p>No items in this category yet.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {products.map((p) => (
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
