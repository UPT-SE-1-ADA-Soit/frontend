import { request } from '@/api/client.js';
import { normalizeSummary } from '@/services/productService.js';

function normalizeProfile(u) {
  return {
    id: u.userId,
    name: u.name,
    location: u.location ?? '',
    avatar: u.avatarUrl ?? null,
  };
}

function normalizeOrder(o) {
  return {
    id: o.id,
    userId: o.userId,
    productId: o.productId,
    productName: o.productName,
    orderedAt: o.orderedAt,
  };
}

export async function fetchUserProfile(userId) {
  const data = await request('auth', `/auth/user/${userId}`);
  return normalizeProfile(data);
}

export async function fetchUserListings(userId) {
  const data = await request('product', `/user/${userId}/listed-products`);
  return data.map(normalizeSummary);
}

export async function fetchUserFavorites(userId) {
  const data = await request('product', `/user/${userId}/favorites`);
  return data.map(normalizeSummary);
}

export async function fetchUserHistory(userId) {
  const data = await request('product', `/user/${userId}/history`);
  return data.map(normalizeSummary);
}

export async function fetchUserOrders(userId) {
  const data = await request('product', `/user/${userId}/orders`);
  return data.map(normalizeOrder);
}

export function addFavorite(userId, productId) {
  return request('product', `/user/${userId}/favorites/${productId}`, { method: 'POST' });
}

export function removeFavorite(userId, productId) {
  return request('product', `/user/${userId}/favorites/${productId}`, { method: 'DELETE' });
}
