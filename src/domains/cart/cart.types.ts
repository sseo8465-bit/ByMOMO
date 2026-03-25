import type { CartItem } from '@/shared/types';

export type { CartItem };

export interface CartSummary {
  itemCount: number;
  totalAmount: number;
}
