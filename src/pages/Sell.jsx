import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, X } from 'lucide-react';

import { CategoryIcon } from '@/components/CategoryIcon.jsx';
import { InputField } from '@/components/InputField.jsx';
import { LoginRequired } from '@/components/LoginRequired.jsx';
import { useAuth } from '@/context/auth.jsx';
import { MOCK_CATEGORIES } from '@/mocks/categories.js';

import styles from './Sell.module.css';

export default function Sell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [photos, setPhotos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [location, setLocation] = useState(user?.location ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  if (!user) return <LoginRequired message="Log in to list an item for sale." />;

  function handleAddPhoto() {
    fileInputRef.current?.click();
  }

  function handlePhotoChange(e) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const remaining = Math.max(0, 5 - photos.length);
    const next = files.slice(0, remaining).map((f) => URL.createObjectURL(f));
    setPhotos((prev) => [...prev, ...next]);
    e.target.value = '';
  }

  function handleRemovePhoto(i) {
    setPhotos((prev) => prev.filter((_, idx) => idx !== i));
  }

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
    // TODO: replace with POST /api/products
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    alert(`Listed! "${title}" is now visible to nearby buyers.`);
    navigate('/');
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
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionLabel}>Photos</h2>
            <span className={styles.photoCount}>{photos.length} / 5</span>
          </div>
          <p className={styles.sectionHint}>
            Up to 5 photos · first photo is the cover
          </p>
          <div className={styles.photosRow}>
            {photos.map((src, i) => (
              <div key={i} className={styles.photoThumb}>
                <img src={src} alt="" className={styles.photoImg} />
                {i === 0 && (
                  <span className={styles.coverBadge}>Cover</span>
                )}
                <button
                  type="button"
                  className={styles.removePhoto}
                  onClick={() => handleRemovePhoto(i)}
                  aria-label="Remove photo"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {photos.length < 5 && (
              <button
                type="button"
                className={styles.addPhoto}
                onClick={handleAddPhoto}
              >
                <Camera size={22} color="#6b7280" />
                <span>Add</span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handlePhotoChange}
          />
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
            {MOCK_CATEGORIES.map((cat) => {
              const active = categoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`${styles.categoryPill} ${active ? styles.categoryPillActive : ''}`}
                  onClick={() => setCategoryId(cat.id)}
                >
                  <CategoryIcon
                    name={cat.icon}
                    size={16}
                    color={active ? '#fff' : '#6B7280'}
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
