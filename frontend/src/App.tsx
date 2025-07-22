import React, { useEffect } from 'react';
import { logTabSwitchEvent } from './utils/api';
import WebcamStream from './components/WebcamStream';
import Dashboard from './components/Dashboard';

const SESSION_ID = 'demo-session-1';

function App() {
  useEffect(() => {
    const handleBlur = () => {
      logTabSwitchEvent(SESSION_ID, 'Window lost focus');
    };
    const handleFocus = () => {
      logTabSwitchEvent(SESSION_ID, 'Window gained focus');
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logTabSwitchEvent(SESSION_ID, 'Tab or window hidden');
      } else {
        logTabSwitchEvent(SESSION_ID, 'Tab or window visible');
      }
    };
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div style={{ display: 'flex', background: '#f7f7f7', height: '100vh' }}>
      {/* Sidebar Dashboard */}
      <aside style={{ width: 400, background: '#fff', borderRight: '1px solid #eee', boxShadow: '2px 0 8px #eee', padding: 0, height: '100vh', overflowY: 'auto' }}>
        <div style={{ padding: 24, borderBottom: '1px solid #eee', background: '#fafbfc' }}>
          <h2 style={{ margin: 0, fontSize: 22 }}>Suspicious Events</h2>
          <span style={{ color: '#888', fontSize: 14 }}>Live Dashboard</span>
        </div>
        <Dashboard />
      </aside>
      {/* Main Proctoring Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: 48, overflow: 'hidden' }}>
        <h1 style={{ fontWeight: 700, fontSize: 32, marginBottom: 8 }}>Proctoring System Demo</h1>
        <p style={{ color: '#555', marginBottom: 32 }}>Tab switch, focus/blur, and webcam face events will be logged as suspicious events.</p>
        <WebcamStream />
      </main>
    </div>
  );
}

export default App;
