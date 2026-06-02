import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, SearchX } from 'lucide-react';

import { CategoryIcon } from '@/components/CategoryIcon.jsx';
import { ProductCard } from '@/components/ProductCard.jsx';
import { SearchBar } from '@/components/SearchBar.jsx';

import { getCategoryStyle } from '@/constants/categoryStyle.js';
import { useCategories } from '@/hooks/useCategories.js';
import { useProducts } from '@/hooks/useProducts.js';

import styles from './Search.module.css';

export default function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { categories } = useCategories();
  const { products, loading, error } = useProducts();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesQuery = !q || p.title.toLowerCase().includes(q);
      const matchesCategory =
        !selectedCategory || p.categoryId === selectedCategory.id;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, selectedCategory]);

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
            name={getCategoryStyle(selectedCategory.id).icon}
            size={18}
            color={getCategoryStyle(selectedCategory.id).iconColor}
          />
          <h2 className={styles.categoryHeaderTitle}>
            {selectedCategory.name}
          </h2>
          <span className={styles.categoryHeaderCount}>
            {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
          </span>
        </div>
      )}

      {isBrowse && (
        <>
          <h2 className={styles.sectionTitle}>Browse by category</h2>
          <div className={styles.categoryGrid}>
            {categories.map((cat) => {
              const style = getCategoryStyle(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={styles.categoryCard}
                  style={{ background: style.bg }}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <CategoryIcon name={style.icon} size={32} color={style.iconColor} />
                  <span className={styles.categoryCardName}>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {!isBrowse && (
        <>
          {!isCategoryView && (
            <h2 className={styles.sectionTitle}>
              Items <span className={styles.count}>· {filtered.length}</span>
            </h2>
          )}

          {loading ? (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>Loading…</p>
            </div>
          ) : error ? (
            <div className={styles.empty}>
              <SearchX size={40} color="#d1d5db" />
              <p className={styles.emptyTitle}>Couldn’t load items</p>
              <p className={styles.emptySubtext}>{error.message}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              <SearchX size={40} color="#d1d5db" />
              <p className={styles.emptyTitle}>No items found</p>
              <p className={styles.emptySubtext}>
                Try different keywords or browse by category.
              </p>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map((p) => (
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
