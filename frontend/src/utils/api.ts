const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export async function logTabSwitchEvent(sessionId: string, reason: string) {
  const timestamp = new Date().toISOString();
  await fetch(`${API_BASE}/events/tab-switch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, reason, timestamp }),
  });
} 