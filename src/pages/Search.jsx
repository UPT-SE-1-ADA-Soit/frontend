import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, SearchX } from 'lucide-react';

import { CategoryIcon } from '@/components/CategoryIcon.jsx';
import { ProductCard } from '@/components/ProductCard.jsx';
import { SearchBar } from '@/components/SearchBar.jsx';

import {
  CATEGORY_BG,
  CATEGORY_ICON_COLOR,
  MOCK_CATEGORIES,
} from '@/mocks/categories.js';
import { MOCK_PRODUCTS } from '@/mocks/products.js';

import styles from './Search.module.css';

export default function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_PRODUCTS.filter((p) => {
      const matchesQuery = !q || p.title.toLowerCase().includes(q);
      const matchesCategory =
        !selectedCategory || p.category.id === selectedCategory.id;
      return matchesQuery && matchesCategory;
    });
  }, [query, selectedCategory]);

  const isBrowse = !selectedCategory && !query.trim();
  const isCategoryView = !!selectedCategory;

  return (
    <div className={styles.page}>
      <div className={styles.searchRow}>
        {isCategoryView ? (
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => {
              setSelectedCategory(null);
              setQuery('');
            }}
            aria-label="Back to categories"
          >
            <ArrowLeft size={22} />
          </button>
        ) : null}
        <div className={styles.searchBarWrap}>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder={
              selectedCategory
                ? `Search in ${selectedCategory.name}…`
                : 'Search items or people…'
            }
            autoFocus
          />
        </div>
      </div>

      {isCategoryView && (
        <div className={styles.categoryHeader}>
          <CategoryIcon
            name={selectedCategory.icon}
            size={18}
            color={CATEGORY_ICON_COLOR[selectedCategory.id]}
          />
          <h2 className={styles.categoryHeaderTitle}>
            {selectedCategory.name}
          </h2>
          <span className={styles.categoryHeaderCount}>
            {products.length} {products.length === 1 ? 'item' : 'items'}
          </span>
        </div>
      )}

      {isBrowse && (
        <>
          <h2 className={styles.sectionTitle}>Browse by category</h2>
          <div className={styles.categoryGrid}>
            {MOCK_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={styles.categoryCard}
                style={{ background: CATEGORY_BG[cat.id] ?? '#F3F4F6' }}
                onClick={() => setSelectedCategory(cat)}
              >
                <CategoryIcon
                  name={cat.icon}
                  size={32}
                  color={CATEGORY_ICON_COLOR[cat.id]}
                />

                <span className={styles.categoryCardName}>{cat.name}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {!isBrowse && (
        <>
          {!isCategoryView && (
            <h2 className={styles.sectionTitle}>
              Items <span className={styles.count}>· {products.length}</span>
            </h2>
          )}

          {products.length === 0 ? (
            <div className={styles.empty}>
              <SearchX size={40} color="#d1d5db" />
              <p className={styles.emptyTitle}>No items found</p>
              <p className={styles.emptySubtext}>
                Try different keywords or browse by category.
              </p>
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
        </>
      )}
    </div>
  );
}
