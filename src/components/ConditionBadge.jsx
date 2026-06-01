import styles from './ConditionBadge.module.css';

const config = {
  new: { label: 'New', color: '#059669', bg: '#D1FAE5' },
  'like-new': { label: 'Like New', color: '#09A5A0', bg: '#CCFBF1' },
  good: { label: 'Good', color: '#2563EB', bg: '#DBEAFE' },
  fair: { label: 'Fair', color: '#D97706', bg: '#FEF3C7' },
};

export function ConditionBadge({ condition }) {
  const c = config[condition];
  if (!c) return null;
  return (
    <span
      className={styles.badge}
      style={{ backgroundColor: c.bg, color: c.color }}
    >
      {c.label}
    </span>
  );
}
