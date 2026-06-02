const BASES = {
  auth: import.meta.env.VITE_AUTH_URL,
  product: import.meta.env.VITE_PRODUCT_URL,
  messaging: import.meta.env.VITE_MESSAGING_URL,
};

export const TOKEN_KEY = 'marketa.token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export async function request(service, path, { method = 'GET', body, token, auth = true } = {}) {
  const base = BASES[service];
  if (!base) throw new Error(`Unknown service: ${service}`);

  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const bearer = token ?? (auth ? getToken() : null);
  if (bearer) headers['Authorization'] = `Bearer ${bearer}`;

  const res = await fetch(base + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await res.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }
  if (!res.ok) {
    const err = new Error(data?.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}
