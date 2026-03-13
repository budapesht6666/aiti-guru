import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Product, ProductPatch, ProductsResponse } from '@/types/product';
import { useAuthStore } from '@/store/useAuthStore';
import { useProductStore } from '@/store/useProductStore';

const BASE = 'https://dummyjson.com';
const PAGE_SIZE = 20;

export interface GetProductsParams {
  sortBy?: string;
  order?: 'asc' | 'desc';
  page?: number;
}

export interface SearchProductsParams {
  q: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  page?: number;
}

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function getProducts(
  params: GetProductsParams,
  token: string,
): Promise<ProductsResponse> {
  const { sortBy = 'title', order = 'asc', page = 1 } = params;
  const skip = (page - 1) * PAGE_SIZE;
  const url = new URL(`${BASE}/products`);
  url.searchParams.set('sortBy', sortBy);
  url.searchParams.set('order', order);
  url.searchParams.set('limit', String(PAGE_SIZE));
  url.searchParams.set('skip', String(skip));

  const res = await fetch(url.toString(), { headers: authHeader(token) });
  if (!res.ok) throw new Error('Не удалось загрузить товары');
  return res.json() as Promise<ProductsResponse>;
}

export async function searchProducts(
  params: SearchProductsParams,
  token: string,
): Promise<ProductsResponse> {
  const { q, sortBy = 'title', order = 'asc', page = 1 } = params;
  const skip = (page - 1) * PAGE_SIZE;
  const url = new URL(`${BASE}/products/search`);
  url.searchParams.set('q', q);
  url.searchParams.set('sortBy', sortBy);
  url.searchParams.set('order', order);
  url.searchParams.set('limit', String(PAGE_SIZE));
  url.searchParams.set('skip', String(skip));

  const res = await fetch(url.toString(), { headers: authHeader(token) });
  if (!res.ok) throw new Error('Не удалось выполнить поиск');
  return res.json() as Promise<ProductsResponse>;
}

export async function updateProduct(
  id: number,
  patch: ProductPatch,
  token: string,
): Promise<Product> {
  const res = await fetch(`${BASE}/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeader(token) },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error('Не удалось обновить товар');
  return res.json() as Promise<Product>;
}

export function useProductsQuery() {
  const token = useAuthStore((s) => s.token) ?? '';
  const { sortBy, order, currentPage, search } = useProductStore();

  return useQuery({
    queryKey: ['products', { sortBy, order, currentPage, search }],
    queryFn: () =>
      search.trim()
        ? searchProducts({ q: search, sortBy, order, page: currentPage }, token)
        : getProducts({ sortBy, order, page: currentPage }, token),
    placeholderData: (prev) => prev,
  });
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token) ?? '';

  return useMutation({
    mutationFn: ({ id, patch }: { id: number; patch: ProductPatch }) =>
      updateProduct(id, patch, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export async function createProduct(
  data: Pick<Product, 'title' | 'price' | 'brand' | 'sku'>,
  token: string,
): Promise<Product> {
  const res = await fetch(`${BASE}/products/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader(token) },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Не удалось добавить товар');
  return res.json() as Promise<Product>;
}

export function useAddProductMutation() {
  const token = useAuthStore((s) => s.token) ?? '';

  return useMutation({
    mutationFn: (data: Pick<Product, 'title' | 'price' | 'brand' | 'sku'>) =>
      createProduct(data, token),
  });
}
