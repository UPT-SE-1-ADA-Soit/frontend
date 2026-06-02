import { request } from '@/api/client.js';

export function normalizeSummary(p) {
  return {
    id: p.id,
    title: p.name,
    price: p.price,
    images: p.thumbnailUrl ? [p.thumbnailUrl] : [],
    location: p.region ?? '',
    categoryId: p.categoryId,
    inStock: p.inStock,
  };
}

export async function fetchProducts(params = {}) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === '') continue;
    if (Array.isArray(v)) v.forEach((item) => qs.append(k, item));
    else qs.append(k, v);
  }
  const suffix = qs.toString() ? `?${qs}` : '';
  const data = await request('product', `/product${suffix}`);
  return data.map(normalizeSummary);
}

function normalizeDetail(p) {
  return {
    id: p.id,
    title: p.name,
    description: p.description ?? '',
    price: p.price,
    images: p.imageUrls ?? [],
    location: p.region ?? '',
    categoryId: p.categoryId,
    categoryName: p.categoryName ?? '',
    sellerId: p.sellerId,
    addedDate: p.addedDate ?? null,
    attributes: p.attributes ?? [],
    inStock: p.inStock,
  };
}

export async function fetchProductDetail(id) {
  const data = await request('product', `/product/${id}`);
  return normalizeDetail(data);
}
