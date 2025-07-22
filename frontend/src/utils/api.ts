const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

console.log('[Proctor] API_BASE:', API_BASE);

export async function logTabSwitchEvent(sessionId: string, reason: string) {
  const timestamp = new Date().toISOString();
  const url = `${API_BASE}/events/tab-switch`;
  console.log('[Proctor] Sending tab switch event:', { url, sessionId, reason, timestamp });
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, reason, timestamp }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error('[Proctor] Backend responded with error:', res.status, text);
    } else {
      console.log('[Proctor] Event logged successfully');
    }
  } catch (err) {
    console.error('[Proctor] Fetch error:', err);
  }
} 