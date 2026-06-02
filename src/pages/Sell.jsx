import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus } from 'lucide-react';

import { CategoryIcon } from '@/components/CategoryIcon.jsx';
import { InputField } from '@/components/InputField.jsx';
import { LoginRequired } from '@/components/LoginRequired.jsx';
import { useAuth } from '@/context/auth.jsx';
import { useCategories } from '@/hooks/useCategories.js';
import { getCategoryStyle } from '@/constants/categoryStyle.js';
import { createProduct } from '@/services/productService.js';

import styles from './Sell.module.css';

export default function Sell() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { categories } = useCategories();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [location, setLocation] = useState(user?.location ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  if (!user) return <LoginRequired message="Log in to list an item for sale." />;

  function validate() {
    if (!title.trim()) return 'Title is required.';
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0)
      return 'Enter a valid price.';
    if (!categoryId) return 'Select a category.';
    if (!location.trim()) return 'Location is required.';
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const error = validate();
    if (error) {
      setSubmitError(error);
      return;
    }
    setSubmitError('');
    setSubmitting(true);
    try {
      const product = await createProduct({
        name: title.trim(),
        categoryId,
        price: Number(price),
        description: description.trim(),
        region: location.trim(),
      });
      navigate(`/product/${product.id}`);
    } catch (err) {
      setSubmitError(err.message || 'Could not list this item.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>List an Item</h1>
        <p className={styles.subtitle}>
          Share what you no longer use. Listings show up in &lsquo;Recent&rsquo;
          right away.
        </p>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>Photos</h2>
          <div className={styles.photoPlaceholder}>
            <ImagePlus size={28} color="#9ca3af" />
            <p className={styles.photoPlaceholderText}>
              Photo upload coming soon
            </p>
            <p className={styles.photoPlaceholderSub}>
              Your listing will go up without an image — you can add one later.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>Details</h2>
          <InputField
            label="Title"
            placeholder="e.g. Nike Air Max 90"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
          />
          <InputField
            label="Description"
            placeholder="Describe the item…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            maxLength={500}
          />
          <div className={styles.priceField}>
            <label className={styles.priceLabel}>Price</label>
            <div className={styles.priceRow}>
              <span className={styles.pricePrefix}>$</span>
              <input
                className={styles.priceInput}
                type="number"
                inputMode="decimal"
                step="0.01"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>Category</h2>
          <div className={styles.categoriesRow}>
            {categories.map((cat) => {
              const active = categoryId === cat.id;
              const style = getCategoryStyle(cat.id);
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`${styles.categoryPill} ${active ? styles.categoryPillActive : ''}`}
                  onClick={() => setCategoryId(cat.id)}
                >
                  <CategoryIcon
                    name={style.icon}
                    size={16}
                    color={active ? '#fff' : style.iconColor}
                  />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </section>

        <section className={styles.section}>
          <InputField
            label="Location"
            placeholder="e.g. Cluj-Napoca, Romania"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            maxLength={60}
          />
        </section>

        {submitError && <p className={styles.error}>{submitError}</p>}

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={submitting}
        >
          {submitting ? 'Listing…' : 'List Item'}
        </button>
      </form>
    </div>
  );
}
