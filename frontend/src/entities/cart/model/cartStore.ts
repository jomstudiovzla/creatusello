import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItemEntity {
  id: string; // ID único del item
  productId: string; // Referencia al producto real en Firebase
  model: any; 
  text: string;
  fontFamily: string;
  quantity: number;
  price: number; // Precio congelado al momento de agregar
}

interface CartState {
  items: CartItemEntity[];
  isOpen: boolean;
  addItem: (item: CartItemEntity) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      
      removeItem: (itemId) => set((state) => ({
        items: state.items.filter(i => i.id !== itemId)
      })),
      
      updateQuantity: (itemId, quantity) => set((state) => ({
        items: state.items.map(i => i.id === itemId ? { ...i, quantity } : i)
      })),
      
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      
      getTotal: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
    }),
    {
      name: 'creatusello-cart-storage', // Clave en localStorage
    }
  )
);
