import styles from './CategoryPill.module.css';

export function CategoryPill({ category, selected, onClick }) {
  return (
    <button
      type="button"
      className={`${styles.pill} ${selected ? styles.pillSelected : ''}`}
      onClick={onClick}
    >
      {category.name}
    </button>
  );
}
