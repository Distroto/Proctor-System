import React, { useEffect, useState } from 'react';
import { fetchEvents } from '../utils/api';
import { useAuth } from '../AuthContext';

interface Event {
  type: string;
  reason?: string;
  numFaces?: number;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const { logout, username } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    const data = await fetchEvents();
    if (!data) {
      setError('Failed to fetch events');
      setLoading(false);
      return;
    }
    setEvents(data.events || []);
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
    const interval = setInterval(loadEvents, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <b>User:</b> {username}
        </div>
        <button onClick={logout} style={{ background: '#eee', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }}>Logout</button>
      </div>
      <h2>Suspicious Events Dashboard</h2>
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