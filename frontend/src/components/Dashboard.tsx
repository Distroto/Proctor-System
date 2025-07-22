import React, { useEffect, useState } from 'react';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

interface Event {
  type: string;
  reason?: string;
  numFaces?: number;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const [sessionId, setSessionId] = useState('demo-session-1');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/events/${sessionId}`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [sessionId]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Suspicious Events Dashboard</h2>
      <label>
        Session ID:{' '}
        <input value={sessionId} onChange={e => setSessionId(e.target.value)} style={{ marginRight: 8 }} />
      </label>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      <table style={{ width: '100%', marginTop: 16, borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Type</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Reason / Faces</th>
            <th style={{ border: '1px solid #ccc', padding: 8 }}>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 && (
            <tr><td colSpan={3} style={{ textAlign: 'center', padding: 16 }}>No events</td></tr>
          )}
          {events.map((ev, i) => (
            <tr key={i}>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{ev.type}</td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>
                {ev.type === 'tab-switch' ? ev.reason : `Faces: ${ev.numFaces}`}
              </td>
              <td style={{ border: '1px solid #ccc', padding: 8 }}>{new Date(ev.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard; 