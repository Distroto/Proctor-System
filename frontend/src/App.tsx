import React, { useEffect } from 'react';
import { logTabSwitchEvent } from './utils/api';
import WebcamStream from './components/WebcamStream';

const SESSION_ID = 'demo-session-1';

function App() {
  useEffect(() => {
    const handleBlur = () => {
      logTabSwitchEvent(SESSION_ID, 'window_blur');
    };
    const handleFocus = () => {
      logTabSwitchEvent(SESSION_ID, 'window_focus');
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logTabSwitchEvent(SESSION_ID, 'tab_hidden');
      } else {
        logTabSwitchEvent(SESSION_ID, 'tab_visible');
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
    <div style={{ padding: 32 }}>
      <h1>Proctoring System Demo</h1>
      <p>Tab switch and focus/blur events will be logged as suspicious events.</p>
      <WebcamStream />
    </div>
  );
}

export default App;
