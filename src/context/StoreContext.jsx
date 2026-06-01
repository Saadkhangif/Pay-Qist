import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { seedProducts } from '../data/seedProducts';
import { getDownPayment, getMonthlyInstallment } from '../lib/currency';
import { hasFirebaseConfig, loadFirebaseStoreTools } from '../lib/firebase';
import { readStorage, writeStorage } from '../lib/storage';

const StoreContext = createContext(null);
const PRODUCTS_KEY = 'payqist_products';
const CART_KEY = 'payqist_cart';
const ORDERS_KEY = 'payqist_orders';
const PAYMENTS_KEY = 'payqist_payments';

function buildInitialProducts() {
  return seedProducts;
}

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
  const [products, setProducts] = useState(() => readStorage(PRODUCTS_KEY, buildInitialProducts()));
  const [cart, setCart] = useState(() => readStorage(CART_KEY, []));
  const [orders, setOrders] = useState(() => readStorage(ORDERS_KEY, []));
  const [payments, setPayments] = useState(() => readStorage(PAYMENTS_KEY, []));
  const seededProductsRef = useRef(false);

  useEffect(() => {
    if (!hasFirebaseConfig) {
      writeStorage(PRODUCTS_KEY, products);
    }
  }, [products]);

  useEffect(() => {
    writeStorage(CART_KEY, cart);
  }, [cart]);

  useEffect(() => {
    if (!hasFirebaseConfig) {
      writeStorage(ORDERS_KEY, orders);
    }
  }, [orders]);

  useEffect(() => {
    if (!hasFirebaseConfig) {
      writeStorage(PAYMENTS_KEY, payments);
    }
  }, [payments]);

  useEffect(() => {
    if (!hasFirebaseConfig) {
      return undefined;
    }

    let unsubscribeProducts = () => undefined;
    let unsubscribeOrders = () => undefined;
    let unsubscribePayments = () => undefined;
    let mounted = true;

    (async () => {
      const tools = await loadFirebaseStoreTools();
      if (!mounted || !tools) {
        return;
      }

      const productsQuery = tools.query(tools.collection(tools.db, 'products'), tools.orderBy('createdAt', 'desc'));
      const ordersQuery = tools.query(tools.collection(tools.db, 'orders'), tools.orderBy('createdAt', 'desc'));
      const paymentsQuery = tools.query(tools.collection(tools.db, 'payments'), tools.orderBy('createdAt', 'desc'));

      unsubscribeProducts = tools.onSnapshot(productsQuery, async (snapshot) => {
        if (snapshot.empty && !seededProductsRef.current) {
          seededProductsRef.current = true;
          const batch = tools.writeBatch(tools.db);
          seedProducts.forEach((product) => {
            const productRef = tools.doc(tools.collection(tools.db, 'products'));
            batch.set(productRef, {
              ...normalizeProduct(product),
              id: productRef.id,
              createdAt: tools.serverTimestamp(),
              updatedAt: tools.serverTimestamp(),
            });
          });
          await batch.commit();
          return;
        }

        const nextProducts = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
        setProducts(nextProducts.length ? nextProducts.map(normalizeProduct) : buildInitialProducts());
      });

      unsubscribeOrders = tools.onSnapshot(ordersQuery, (snapshot) => {
        const nextOrders = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
        setOrders(nextOrders.map(normalizeOrder));
      });

      unsubscribePayments = tools.onSnapshot(paymentsQuery, (snapshot) => {
        const nextPayments = snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
        setPayments(nextPayments.map(normalizePayment));
      });
    })();

    return () => {
      mounted = false;
      unsubscribeProducts();
      unsubscribeOrders();
      unsubscribePayments();
    };
  }, []);

  async function addProduct(product) {
    const payload = normalizeProduct(product);

    if (hasFirebaseConfig) {
      const tools = await loadFirebaseStoreTools();
      const productRef = await tools.addDoc(tools.collection(tools.db, 'products'), {
        ...payload,
        createdAt: tools.serverTimestamp(),
        updatedAt: tools.serverTimestamp(),
      });

      return { id: productRef.id, ...payload };
    }

    const nextProduct = {
      id: crypto.randomUUID(),
      ...payload,
    };

    setProducts((currentProducts) => [nextProduct, ...currentProducts]);
    return nextProduct;
  }

  async function updateProduct(productId, updates) {
    const payload = normalizeProduct(updates);

    if (hasFirebaseConfig) {
      const tools = await loadFirebaseStoreTools();
      await tools.updateDoc(tools.doc(tools.db, 'products', productId), {
        ...payload,
        updatedAt: tools.serverTimestamp(),
      });
      return;
    }

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
    if (hasFirebaseConfig) {
      const tools = await loadFirebaseStoreTools();
      await tools.deleteDoc(tools.doc(tools.db, 'products', productId));
      return;
    }

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

    if (!hasFirebaseConfig) {
      return URL.createObjectURL(file);
    }

    const tools = await loadFirebaseStoreTools();
    const storageRef = tools.ref(tools.storage, `product-images/${productId}/${crypto.randomUUID()}-${file.name}`);
    const snapshot = await tools.uploadBytes(storageRef, file);
    return tools.getDownloadURL(snapshot.ref);
  }

  async function createOrderFromCart(user, paymentMethod, paymentReference = '') {
    const createdAt = new Date().toISOString();
    const nextOrders = cart.map((item) => {
      const monthlyPayment = getMonthlyInstallment(item.price, item.installmentMonths);
      const downPayment = getDownPayment(item.price);

      return {
        userId: user?.id || 'guest',
        userName: user?.name || 'Guest Shopper',
        userEmail: user?.email || 'guest@payqist.com',
        productId: item.productId,
        productTitle: item.title,
        productImage: item.imageUrl,
        installmentMonths: item.installmentMonths,
        quantity: item.quantity,
        price: item.price,
        monthlyPayment,
        downPayment,
        paymentMethod,
        paymentReference,
        paymentStatus: 'Paid',
        applicationStatus: 'Submitted',
        createdAt,
      };
    });
    const nextPayments = nextOrders.map((order) => ({
      userId: order.userId,
      userName: order.userName,
      userEmail: order.userEmail,
      orderTitle: order.productTitle,
      amount: order.downPayment,
      paymentMethod: order.paymentMethod,
      paymentReference: order.paymentReference,
      paymentStatus: order.paymentStatus,
      createdAt,
    }));

    if (hasFirebaseConfig) {
      const tools = await loadFirebaseStoreTools();
      for (const order of nextOrders) {
        await tools.addDoc(tools.collection(tools.db, 'orders'), {
          ...order,
          createdAt: tools.serverTimestamp(),
          updatedAt: tools.serverTimestamp(),
        });
      }
      for (const payment of nextPayments) {
        await tools.addDoc(tools.collection(tools.db, 'payments'), {
          ...payment,
          createdAt: tools.serverTimestamp(),
          updatedAt: tools.serverTimestamp(),
        });
      }
      setCart([]);
      return nextOrders;
    }

    const storedOrders = nextOrders.map((order) => ({ id: crypto.randomUUID(), ...order }));
    const storedPayments = nextPayments.map((payment) => ({ id: crypto.randomUUID(), ...payment }));
    setOrders((currentOrders) => [...storedOrders, ...currentOrders]);
    setPayments((currentPayments) => [...storedPayments, ...currentPayments]);
    setCart([]);
    return storedOrders;
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
      storeMode: hasFirebaseConfig ? 'firebase' : 'local',
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