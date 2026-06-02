import { request } from '@/api/client.js';

function normalizeUser(data) {
  return {
    id: data.userId,
    email: data.email ?? '',
    name: data.name ?? '',
    location: data.location ?? '',
    avatar: data.avatarUrl ?? null,
  };
}

export async function login(email, password) {
  const data = await request('auth', '/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  return { token: data.token, user: normalizeUser(data) };
}

export async function register({ name, email, password, phone }) {
  const data = await request('auth', '/auth/register', {
    method: 'POST',
    body: { name, email, password, phone },
  });
  return { token: data.token, user: normalizeUser(data) };
}

export async function validateToken() {
  const data = await request('auth', '/auth/validate');
  return normalizeUser(data);
}

export async function updateProfile(patch) {
  const data = await request('auth', '/auth/profile', {
    method: 'PUT',
    body: {
      name: patch.name,
      location: patch.location,
      avatarUrl: patch.avatar,
    },
  });
  return normalizeUser(data);
}