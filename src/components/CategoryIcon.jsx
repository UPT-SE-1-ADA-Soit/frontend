import {
  Shirt,
  Smartphone,
  Armchair,
  BookOpen,
  Dumbbell,
  Car,
  Home,
  Grid,
} from 'lucide-react';

const ICONS = {
  shirt: Shirt,
  smartphone: Smartphone,
  armchair: Armchair,
  'book-open': BookOpen,
  dumbbell: Dumbbell,
  car: Car,
  home: Home,
  grid: Grid,
};

export function CategoryIcon({ name, size = 24, color }) {
  const Comp = ICONS[name] ?? Grid;
  return <Comp size={size} color={color} strokeWidth={2} />;
}
