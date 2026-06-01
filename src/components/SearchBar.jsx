import { Search, X } from 'lucide-react';
import styles from './SearchBar.module.css';

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search for items...',
  autoFocus,
}) {
  return (
    <div className={styles.bar}>
      <Search size={18} className={styles.icon} />
      <input
        type="search"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        autoFocus={autoFocus}
      />
      {value && (
        <button
          type="button"
          className={styles.clear}
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
