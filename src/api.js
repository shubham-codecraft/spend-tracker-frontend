// Wrapper around the Spend Tracker backend REST API.

function buildQuery(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.startDate) params.set('start_date', filters.startDate);
  if (filters.endDate) params.set('end_date', filters.endDate);
  return params;
}

function headers(token) {
  const h = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

async function parseJsonSafe(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

async function requestJson(res, fallbackMessage) {
  if (!res.ok) {
    const err = await parseJsonSafe(res);
    const detail =
      typeof err.errors !== 'undefined'
        ? JSON.stringify(err.errors)
        : err.detail || `${fallbackMessage} (${res.status})`;
    throw new Error(detail);
  }
  return res.json();
}

export async function login(apiBase, payload) {
  const res = await fetch(`${apiBase}/auth/login`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return requestJson(res, 'Login failed');
}

export async function fetchExpenses(apiBase, token, filters) {
  const params = buildQuery(filters);
  const res = await fetch(`${apiBase}/expenses?${params.toString()}`, {
    headers: headers(token),
  });
  return requestJson(res, 'Failed to load expenses');
}

export async function fetchSummary(apiBase, token, filters) {
  const params = buildQuery(filters);
  const res = await fetch(`${apiBase}/summary?${params.toString()}`, {
    headers: headers(token),
  });
  return requestJson(res, 'Failed to load summary');
}

export async function createExpense(apiBase, token, payload) {
  const res = await fetch(`${apiBase}/expenses`, {
    method: 'POST',
    headers: headers(token),
    body: JSON.stringify(payload),
  });
  return requestJson(res, 'Failed to add expense');
}
