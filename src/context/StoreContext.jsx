import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { apiFetch, usesSecureApi } from '../lib/api';
import { getDownPayment, getMonthlyInstallment } from '../lib/currency';
import { readStorage, writeStorage } from '../lib/storage';

const StoreContext = createContext(null);
const CART_KEY = 'payqist_cart';

function normalizeProduct(product) {
  return {
    ...product,
    title: product.title,
    description: product.description,
    price: Number(product.price),
    category: product.category || 'Uncategorized',
    allowedInstallmentMonths: product.allowedInstallmentMonths || [3, 6, 12],
    featured: Boolean(product.featured),
  };
}

function normalizeOrder(order) {
  return {
    ...order,
    quantity: Number(order.quantity || 1),
    price: Number(order.price || 0),
    monthlyPayment: Number(order.monthlyPayment || 0),
    downPayment: Number(order.downPayment || 0),
  };
}

function normalizePayment(payment) {
  return {
    ...payment,
    amount: Number(payment.amount || 0),
  };
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => readStorage(CART_KEY, []));
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const seededProductsRef = useRef(false);

  useEffect(() => {
    writeStorage(CART_KEY, cart);
  }, [cart]);

  // Fetch initial data from Node.js API
  useEffect(() => {
    if (!usesSecureApi()) return;

    apiFetch('/api/products').then(setProducts).catch(console.error);
    apiFetch('/api/orders').then(setOrders).catch(console.error);
    apiFetch('/api/payments').then(setPayments).catch(console.error);
  }, []);

  async function addProduct(product) {
    const payload = normalizeProduct(product);

    const nextProduct = await apiFetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setProducts((currentProducts) => [nextProduct, ...currentProducts]);
    return nextProduct;
  }

  async function updateProduct(productId, updates) {
    const payload = normalizeProduct(updates);
    await apiFetch(`/api/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              ...payload,
            }
          : product,
      ),
    );
  }

  async function removeProduct(productId) {
    await apiFetch(`/api/products/${productId}`, { method: 'DELETE' });
    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId));
  }

  function addToCart(product, months) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.productId === product.id && item.installmentMonths === months);
      if (existingItem) {
        return currentCart.map((item) =>
          item.id === existingItem.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [
        {
          id: crypto.randomUUID(),
          productId: product.id,
          title: product.title,
          price: product.price,
          imageUrl: product.imageUrl,
          installmentMonths: months,
          quantity: 1,
        },
        ...currentCart,
      ];
    });
  }

  function updateCartMonths(itemId, months) {
    setCart((currentCart) =>
      currentCart.map((item) => (item.id === itemId ? { ...item, installmentMonths: months } : item)),
    );
  }

  function removeFromCart(itemId) {
    setCart((currentCart) => currentCart.filter((item) => item.id !== itemId));
  }

  function clearCart() {
    setCart([]);
  }

  async function uploadProductImage(file, productId = 'draft') {
    if (!file) {
      return '';
    }

    return URL.createObjectURL(file);
  }

  async function createOrderFromCart(_user, paymentMethod, paymentReference = '') {
    const payload = {
      cart: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        installmentMonths: item.installmentMonths,
      })),
      paymentMethod,
      paymentReference,
    };
    const { createdOrders, createdPayments } = await apiFetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    setOrders((currentOrders) => [...createdOrders, ...currentOrders]);
    setPayments((currentPayments) => [...createdPayments, ...currentPayments]);
    setCart([]);
    return createdOrders;
  }

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalPayments = payments.length;
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartDownPayment = cart.reduce((sum, item) => sum + getDownPayment(item.price) * item.quantity, 0);

    return {
      totalProducts,
      totalOrders,
      totalPayments,
      cartTotal,
      cartDownPayment,
    };
  }, [cart, orders, payments, products]);

  const value = useMemo(
    () => ({
      products,
      cart,
      orders,
      payments,
      stats,
      addProduct,
      updateProduct,
      removeProduct,
      addToCart,
      updateCartMonths,
      removeFromCart,
      clearCart,
      createOrderFromCart,
      uploadProductImage,
      storeMode: 'node',
    }),
    [cart, orders, payments, products, stats],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }

  return context;
}