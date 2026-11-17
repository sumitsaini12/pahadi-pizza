import {
  Pizza,
  Popcorn,
  UtensilsCrossed,
  Hamburger,
  CookingPot,
  Soup,
  CupSoda,
  type LucideIcon,
} from 'lucide-react';
import { MenuItem } from '../../types';

/** Menu categories in display order, shared by the phone and desktop menus. */
export const CATEGORIES: { id: MenuItem['category']; icon: LucideIcon }[] = [
  { id: 'Veg Pizzas', icon: Pizza },
  { id: 'Starters', icon: Popcorn },
  { id: 'Pasta', icon: UtensilsCrossed },
  { id: 'Burger', icon: Hamburger },
  { id: 'Momo', icon: CookingPot },
  { id: 'Chowmein', icon: Soup },
  { id: 'Shake', icon: CupSoda },
];

export const FALLBACK_IMG = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800';

/** Momo and chowmein variants are portions, everything else is a size. */
export const sizeLabel = (item: MenuItem) => (['Momo', 'Chowmein'].includes(item.category) ? 'Quantity' : 'Select Size');
