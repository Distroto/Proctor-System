import React, { useState } from 'react';
import { useAuth } from '../AuthContext';

const LoginSignup: React.FC = () => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const ok = mode === 'login'
      ? await login(username, password)
      : await signup(username, password);
    setLoading(false);
    if (!ok) setError('Invalid credentials or user already exists.');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f7f7' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 32, borderRadius: 8, boxShadow: '0 2px 16px #eee', minWidth: 320 }}>
        <h2 style={{ marginBottom: 16 }}>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ width: '100%', padding: 8, marginBottom: 8, border: '1px solid #ccc', borderRadius: 4 }}
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
        <button type="submit" style={{ width: '100%', padding: 10, background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600 }} disabled={loading}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}
        </button>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          {mode === 'login' ? (
            <span>New user? <button type="button" style={{ color: '#007bff', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setMode('signup')}>Sign Up</button></span>
          ) : (
            <span>Already have an account? <button type="button" style={{ color: '#007bff', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setMode('login')}>Login</button></span>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginSignup; 