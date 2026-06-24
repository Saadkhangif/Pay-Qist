import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch, uploadBlobFile } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useCartStore } from '../stores/cartStore';

export const productKeys = { all: ['products'] };
export const orderKeys = { mine: ['orders'] };
export const paymentKeys = { mine: ['payments'] };
export const applicationKeys = { all: ['applications'] };

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

export async function uploadProductImage(file, productId = 'draft') {
  if (!file) {
    return '';
  }

  try {
    const result = await uploadBlobFile(file, {
      access: 'public',
      folder: 'products',
      entityType: 'product',
      entityId: productId,
    });
    return result.url;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Blob upload unavailable, using local preview URL:', error.message);
      return URL.createObjectURL(file);
    }

    throw error;
  }
}

export function useProducts() {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: () => apiFetch('/api/products'),
  });
}

export function useOrders() {
  const { user } = useAuth();
  return useQuery({
    queryKey: orderKeys.mine,
    queryFn: () => apiFetch('/api/orders'),
    enabled: Boolean(user),
  });
}

export function usePayments() {
  const { user } = useAuth();
  return useQuery({
    queryKey: paymentKeys.mine,
    queryFn: () => apiFetch('/api/payments'),
    enabled: Boolean(user),
  });
}

export function useApplications({ enabled = true } = {}) {
  const { user } = useAuth();
  return useQuery({
    queryKey: applicationKeys.all,
    queryFn: () => apiFetch('/api/applications'),
    enabled: Boolean(user?.role === 'admin' && enabled),
  });
}

export function useAddProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (product) => {
      const payload = normalizeProduct(product);
      return apiFetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (created) => {
      queryClient.setQueryData(productKeys.all, (previous = []) => [created, ...previous]);
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, updates }) => {
      const payload = normalizeProduct(updates);
      return apiFetch(`/api/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      }).then(() => ({ productId, payload }));
    },
    onSuccess: ({ productId, payload }) => {
      queryClient.setQueryData(productKeys.all, (previous = []) =>
        previous.map((product) =>
          product.id === productId
            ? {
                ...product,
                ...payload,
              }
            : product,
        ),
      );
    },
  });
}

export function useRemoveProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId) =>
      apiFetch(`/api/products/${productId}`, { method: 'DELETE' }).then(() => productId),
    onSuccess: (productId) => {
      queryClient.setQueryData(productKeys.all, (previous = []) =>
        previous.filter((product) => product.id !== productId),
      );
    },
  });
}

function buildCartPayload(cart, extras = {}) {
  return {
    cart: cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      installmentMonths: item.installmentMonths || 12,
    })),
    paymentMethod: extras.paymentMethod || 'card',
    paymentReference: extras.paymentReference || '',
    ...extras,
  };
}

export function useCheckout() {
  const queryClient = useQueryClient();
  const clearCart = useCartStore((state) => state.clearCart);

  return useMutation({
    mutationFn: ({ paymentMethod, paymentReference = '' }) => {
      const cart = useCartStore.getState().cart;
      return apiFetch('/api/checkout', {
        method: 'POST',
        body: JSON.stringify(buildCartPayload(cart, { paymentMethod, paymentReference })),
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: orderKeys.mine });
      const previousOrders = queryClient.getQueryData(orderKeys.mine);
      const previousPayments = queryClient.getQueryData(paymentKeys.mine);
      return { previousOrders, previousPayments };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(orderKeys.mine, context.previousOrders);
      }
      if (context?.previousPayments) {
        queryClient.setQueryData(paymentKeys.mine, context.previousPayments);
      }
    },
    onSuccess: ({ createdOrders, createdPayments }) => {
      queryClient.setQueryData(orderKeys.mine, (previous = []) => [...createdOrders, ...previous]);
      queryClient.setQueryData(paymentKeys.mine, (previous = []) => [...createdPayments, ...previous]);
      clearCart();
    },
  });
}

export function useSubmitInstallmentApplication() {
  const queryClient = useQueryClient();
  const clearCart = useCartStore((state) => state.clearCart);

  return useMutation({
    mutationFn: ({ applicant, referral, paymentMethod, paymentReference = '' }) => {
      const cart = useCartStore.getState().cart;
      return apiFetch('/api/applications/submit', {
        method: 'POST',
        body: JSON.stringify(
          buildCartPayload(cart, {
            paymentMethod,
            paymentReference,
            applicant,
            referral,
          }),
        ),
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: orderKeys.mine });
      const previousOrders = queryClient.getQueryData(orderKeys.mine);
      const previousPayments = queryClient.getQueryData(paymentKeys.mine);
      return { previousOrders, previousPayments };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(orderKeys.mine, context.previousOrders);
      }
      if (context?.previousPayments) {
        queryClient.setQueryData(paymentKeys.mine, context.previousPayments);
      }
    },
    onSuccess: ({ createdOrders, createdPayments }) => {
      queryClient.setQueryData(orderKeys.mine, (previous = []) => [...createdOrders, ...previous]);
      queryClient.setQueryData(paymentKeys.mine, (previous = []) => [...createdPayments, ...previous]);
      clearCart();
    },
  });
}
