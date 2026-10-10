export type CategoryType = 'tamanhos' | 'bases' | 'frutas' | 'cremes' | 'doces' | 'extras';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: CategoryType;
  description?: string;
}

export interface CupSize {
  id: string;
  name: string;
  volume: string; // e.g., "350ml"
  price: number;
  image?: string;
}

export interface CupIngredient extends Product {
  quantity: number;
  rotation?: number; // Random rotation for animation
}

export interface CupState {
  size: CupSize | null;
  base: CupIngredient | null;
  ingredients: CupIngredient[];
}

export const CATEGORIES: { id: CategoryType; label: string; icon: string }[] = [
  { id: 'tamanhos', label: 'Tamanhos', icon: 'cup-soda' },
  { id: 'bases', label: 'Bases', icon: 'blob' },
  { id: 'frutas', label: 'Frutas', icon: 'apple' },
  { id: 'cremes', label: 'Cremes', icon: 'ice-cream' },
  { id: 'doces', label: 'Doces', icon: 'candy' },
  { id: 'extras', label: 'Extras', icon: 'sparkles' },
];

export function calculateTotal(state: CupState): number {
  let total = state.size?.price || 0;
  if (state.base) total += state.base.price;
  total += state.ingredients.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return total;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}