import { create } from 'zustand';

export interface User {
  uid: string;
  email: string | null;
  rol?: string;
}

export interface CartItem {
  id: string; // unique item id
  model: any; // e.g. { type: 'Automático', price: 19.50, ... }
  text: string;
  fontFamily: string;
  fontFile?: File | null;
  fontDataUrl?: string | null;
  logoFile?: File | null;
  logoDataUrl?: string | null; // for preview
  quantity: number;
}

export type Currency = 'EUR' | 'USD' | 'VES';

interface StoreState {
  user: User | null;
  cart: CartItem[];
  isCartOpen: boolean;
  isAdminLoggedIn: boolean;
  currency: Currency;
  exchangeRates: { EUR: number, USD: number, VES: number };
  isAuthInitialized: boolean;
  setAuthInitialized: (status: boolean) => void;
  setCurrency: (curr: Currency) => void;
  setExchangeRates: (rates: { EUR: number, USD: number, VES: number }) => void;
  setUser: (user: User | null) => void;
  setAdminStatus: (status: boolean) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useStore = create<StoreState>((set) => ({
  user: null,
  cart: [],
  isCartOpen: false,
  isAdminLoggedIn: sessionStorage.getItem('isAdminLoggedIn') === 'true',
  currency: 'EUR',
  exchangeRates: { EUR: 1, USD: 1.08, VES: 39.50 }, // Valores iniciales de fallback
  isAuthInitialized: false,
  
  setAuthInitialized: (status) => set({ isAuthInitialized: status }),
  setCurrency: (currency) => set({ currency }),
  setExchangeRates: (exchangeRates) => set({ exchangeRates }),
  
  setUser: (user) => set({ user }),
  
  setAdminStatus: (status) => {
    if (status) {
      sessionStorage.setItem('isAdminLoggedIn', 'true');
    } else {
      sessionStorage.removeItem('isAdminLoggedIn');
    }
    set({ isAdminLoggedIn: status });
  },
  
  addToCart: (item) => set((state) => {
    return { cart: [...state.cart, item] };
  }),
  
  removeFromCart: (itemId) => set((state) => ({
    cart: state.cart.filter(item => item.id !== itemId)
  })),
  
  updateQuantity: (itemId, quantity) => set((state) => ({
    cart: state.cart.map(item => item.id === itemId ? { ...item, quantity } : item)
  })),
  
  clearCart: () => set({ cart: [] }),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
}));
