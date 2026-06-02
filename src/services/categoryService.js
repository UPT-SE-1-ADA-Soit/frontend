import { request } from '@/api/client.js';

export function fetchCategories() {
  return request('product', '/category');
}

export function fetchCategoryById(id) {
  return request('product', `/category/${id}`);
}
