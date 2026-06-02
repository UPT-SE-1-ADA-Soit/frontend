import { request } from '@/api/client.js';

function normalizeProfile(u) {
  return {
    id: u.userId,
    name: u.name,
    location: u.location ?? '',
    avatar: u.avatarUrl ?? null,
  };
}

export async function fetchUserProfile(userId) {
  const data = await request('auth', `/auth/user/${userId}`);
  return normalizeProfile(data);
}
