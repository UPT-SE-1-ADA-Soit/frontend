import {
  Shirt,
  Smartphone,
  Armchair,
  BookOpen,
  Dumbbell,
  Car,
  Home,
  Grid,
  Trees,
  Gamepad2,
  Refrigerator,
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
  trees: Trees,
  'gamepad-2': Gamepad2,
  refrigerator: Refrigerator,
};

export function CategoryIcon({ name, size = 24, color }) {
  const Comp = ICONS[name] ?? Grid;
  return <Comp size={size} color={color} strokeWidth={2} />;
}
