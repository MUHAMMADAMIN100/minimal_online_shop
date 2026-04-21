import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types';

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (productId: string, size?: string) => void;
  setQty: (productId: string, quantity: number, size?: string) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
};

const keyOf = (i: { productId: string; size?: string }) => `${i.productId}::${i.size || ''}`;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      add(item) {
        const items = [...get().items];
        const idx = items.findIndex((i) => keyOf(i) === keyOf(item));
        if (idx >= 0) items[idx] = { ...items[idx], quantity: items[idx].quantity + item.quantity };
        else items.push(item);
        set({ items });
      },

      remove(productId, size) {
        set({ items: get().items.filter((i) => keyOf(i) !== keyOf({ productId, size })) });
      },

      setQty(productId, quantity, size) {
        if (quantity <= 0) return get().remove(productId, size);
        set({
          items: get().items.map((i) =>
            keyOf(i) === keyOf({ productId, size }) ? { ...i, quantity } : i,
          ),
        });
      },

      clear() {
        set({ items: [] });
      },

      total() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      },

      count() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    { name: 'cart' },
  ),
);
