import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set) => ({
      cart: [],
      addToCart: (product, months = product?.installmentMonths ?? 12) => {
        const installmentMonths = months ?? product?.installmentMonths ?? 12;
        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.productId === product.id && item.installmentMonths === installmentMonths,
          );
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === existingItem.id ? { ...item, quantity: item.quantity + 1 } : item,
              ),
            };
          }

          return {
            cart: [
              {
                id: crypto.randomUUID(),
                productId: product.id,
                title: product.title,
                price: product.price,
                imageUrl: product.imageUrl,
                installmentMonths,
                quantity: 1,
              },
              ...state.cart,
            ],
          };
        });
      },
      updateCartMonths: (itemId, months) =>
        set((state) => ({
          cart: state.cart.map((item) => (item.id === itemId ? { ...item, installmentMonths: months } : item)),
        })),
      removeFromCart: (itemId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== itemId),
        })),
      clearCart: () => set({ cart: [] }),
    }),
    { name: 'payqist_cart' },
  ),
);

export const useCartCount = () => useCartStore((state) => state.cart.length);
export const useCartItems = () => useCartStore((state) => state.cart);
