import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/context/auth.jsx';
import { useLikes } from '@/context/likes.jsx';
import styles from './ProductCard.module.css';

export function ProductCard({ product, onClick }) {
  const { user } = useAuth();
  const { isLiked, toggleLike } = useLikes();
  const navigate = useNavigate();
  const liked = user ? isLiked(product.id) : false;

  function handleHeartClick(e) {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    toggleLike(product.id);
  }

  return (
    <button
      type="button"
      className={styles.card}
      onClick={onClick}
      aria-label={`Open ${product.title}`}
    >
      <div className={styles.imageWrap}>
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
        <span
          className={`${styles.heartBtn} ${liked ? styles.heartLiked : ''}`}
          onClick={handleHeartClick}
          role="button"
          tabIndex={0}
          aria-label={liked ? 'Remove from favourites' : 'Save to favourites'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleHeartClick(e);
            }
          }}
        >
          <Heart
            size={16}
            fill={liked ? 'currentColor' : 'none'}
            strokeWidth={2}
          />
        </span>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.price}>${product.price}</p>
        <p className={styles.location}>{product.location}</p>
      </div>
    </button>
  );
}
