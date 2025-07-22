const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

console.log('[Proctor] API_BASE:', API_BASE);

function getToken() {
  return localStorage.getItem('token');
}

export async function logTabSwitchEvent(sessionId: string, reason: string) {
  const timestamp = new Date().toISOString();
  const url = `${API_BASE}/events/tab-switch`;
  const token = getToken();
  if (!token) return;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ reason, timestamp }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('[Proctor] Backend responded with error:', res.status, text);
    }
  } catch (err) {
    console.error('[Proctor] Fetch error:', err);
  }
}

export async function fetchEvents() {
  const url = `${API_BASE}/events`;
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function getSessionId() {
  return localStorage.getItem('sessionId');
} 