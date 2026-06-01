import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  MapPin,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { ConditionBadge } from '@/components/ConditionBadge.jsx';
import { useAuth } from '@/context/auth.jsx';
import { useLikes } from '@/context/likes.jsx';
import { MOCK_PRODUCTS } from '@/mocks/products.js';

import styles from './ProductDetail.module.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isLiked, toggleLike } = useLikes();

  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  const [activeImage, setActiveImage] = useState(0);
  const [buying, setBuying] = useState(false);

  if (!product) {
    return (
      <div className={styles.notFound}>
        <p>Product not found.</p>
        <button
          type="button"
          className={styles.backLink}
          onClick={() => navigate(-1)}
        >
          ← Go back
        </button>
      </div>
    );
  }

  const liked = user ? isLiked(product.id) : false;
  const images = product.images.length > 0 ? product.images : [null];

  async function handleBuy() {
    if (!user) {
      navigate('/login');
      return;
    }
    setBuying(true);
    await new Promise((r) => setTimeout(r, 600));
    setBuying(false);
    alert(`Order placed! You bought "${product.title}".`);
  }

  function handleMessage() {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/chat/${product.seller.id}?productId=${product.id}`);
  }

  function handleLike() {
    if (!user) {
      navigate('/login');
      return;
    }
    toggleLike(product.id);
  }

  const isOwnListing = user?.id === product.seller.id;

  return (
    <div className={styles.page}>
      <div className={styles.gallery}>
        <button
          type="button"
          className={styles.floatBtnBack}
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>

        {user && (
          <button
            type="button"
            className={`${styles.floatBtnLike} ${liked ? styles.floatBtnLiked : ''}`}
            onClick={handleLike}
            aria-label={liked ? 'Remove from favourites' : 'Save to favourites'}
          >
            <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
          </button>
        )}

        {images[activeImage] ? (
          <img
            src={images[activeImage]}
            alt={product.title}
            className={styles.heroImage}
          />
        ) : (
          <div className={styles.heroPlaceholder} />
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              className={`${styles.navArrow} ${styles.navArrowLeft}`}
              onClick={() =>
                setActiveImage((i) => (i - 1 + images.length) % images.length)
              }
              aria-label="Previous image"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              className={`${styles.navArrow} ${styles.navArrowRight}`}
              onClick={() => setActiveImage((i) => (i + 1) % images.length)}
              aria-label="Next image"
            >
              <ChevronRight size={22} />
            </button>
            <div className={styles.dots}>
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`${styles.dot} ${i === activeImage ? styles.dotActive : ''}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.priceRow}>
          <h1 className={styles.price}>${product.price}</h1>
          {product.condition && <ConditionBadge condition={product.condition} />}
        </div>

        <h2 className={styles.title}>{product.title}</h2>

        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            <MapPin size={14} /> {product.location}
          </span>
          <span className={styles.metaItem}>
            <Eye size={14} /> {product.views} views
          </span>
        </div>

        {product.description && (
          <>
            <div className={styles.divider} />
            <h3 className={styles.sectionLabel}>Description</h3>
            <p className={styles.description}>{product.description}</p>
          </>
        )}

        <div className={styles.divider} />
        <h3 className={styles.sectionLabel}>Seller</h3>
        <div className={styles.sellerRow}>
          {product.seller.avatar ? (
            <img
              src={product.seller.avatar}
              alt={product.seller.name}
              className={styles.sellerAvatar}
            />
          ) : (
            <div
              className={`${styles.sellerAvatar} ${styles.sellerAvatarFallback}`}
            >
              {product.seller.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className={styles.sellerInfo}>
            <p className={styles.sellerName}>{product.seller.name}</p>
            {product.seller.location && (
              <p className={styles.sellerLocation}>
                {product.seller.location}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <button
          type="button"
          className={styles.messageBtn}
          onClick={handleMessage}
          disabled={isOwnListing}
          title={isOwnListing ? "You can't message yourself" : undefined}
        >
          <MessageCircle size={17} />
          Message
        </button>
        <button
          type="button"
          className={styles.buyBtn}
          onClick={handleBuy}
          disabled={buying || isOwnListing}
        >
          {buying ? 'Placing order…' : `Buy · $${product.price}`}
        </button>
      </div>
    </div>
  );
}
