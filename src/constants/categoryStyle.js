const STYLES = {
  1: { icon: 'smartphone', bg: '#DBEAFE', iconColor: '#3B82F6' },
  2: { icon: 'shirt', bg: '#FEE2E2', iconColor: '#EF4444' },
  3: { icon: 'armchair', bg: '#FEF3C7', iconColor: '#F59E0B' },
  4: { icon: 'dumbbell', bg: '#FCE7F3', iconColor: '#EC4899' },
  5: { icon: 'book-open', bg: '#D1FAE5', iconColor: '#10B981' },
  6: { icon: 'trees', bg: '#DCFCE7', iconColor: '#16A34A' },
  7: { icon: 'car', bg: '#EDE9FE', iconColor: '#8B5CF6' },
  8: { icon: 'gamepad-2', bg: '#E0E7FF', iconColor: '#6366F1' },
  9: { icon: 'refrigerator', bg: '#CFFAFE', iconColor: '#06B6D4' },
};

const FALLBACK = { icon: 'grid', bg: '#F3F4F6', iconColor: '#6B7280' };

export function getCategoryStyle(categoryId) {
  return STYLES[categoryId] ?? FALLBACK;
}
