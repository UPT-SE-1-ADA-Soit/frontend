import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CategoryPill } from '@/components/CategoryPill.jsx';
import { ProductCard } from '@/components/ProductCard.jsx';
import { SearchBar } from '@/components/SearchBar.jsx';

import { MOCK_CATEGORIES } from '@/mocks/categories.js';
import { MOCK_PRODUCTS } from '@/mocks/products.js';

import styles from './Landing.module.css';

export default function Landing() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_PRODUCTS.filter((p) => {
      const matchesQuery = !q || p.title.toLowerCase().includes(q);
      const matchesCategory =
        !selectedCategory || p.category.id === selectedCategory;
      return matchesQuery && matchesCategory;
    });
  }, [query, selectedCategory]);

  const hasFilter = query.trim() || selectedCategory;

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.eyebrow}>Marketa</span>
          <h1 className={styles.heroTitle}>
            Buy &amp; sell from people <span>nearby</span>.
          </h1>
          <p className={styles.heroSubtitle}>
            Discover one-of-a-kind finds from your neighbourhood, or list
            something of your own in under a minute.
          </p>
          <div className={styles.heroActions}>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => navigate('/register')}
            >
              Get started
            </button>
            <button
              type="button"
              className={styles.btnGhost}
              onClick={() => navigate('/login')}
            >
              I already have an account
            </button>
          </div>
        </div>
      </section>

      <section className={styles.search}>
        <SearchBar value={query} onChange={setQuery} />
      </section>

      <section className={styles.categories}>
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
      </section>

      <section className={styles.results}>
        <h2 className={styles.sectionTitle}>
          {hasFilter ? `${products.length} results` : 'Recent listings'}
        </h2>

        {products.length === 0 ? (
          <div className={styles.empty}>
            <p>No items found. Try a different search.</p>
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
      </section>
    </div>
  );
}
