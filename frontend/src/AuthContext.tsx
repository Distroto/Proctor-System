import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthState {
  token: string | null;
  sessionId: string | null;
  username: string | null;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    const s = localStorage.getItem('sessionId');
    const u = localStorage.getItem('username');
    if (t && s && u) {
      setToken(t);
      setSessionId(s);
      setUsername(u);
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      setToken(data.token);
      setSessionId(data.sessionId);
      setUsername(username);
      localStorage.setItem('token', data.token);
      localStorage.setItem('sessionId', data.sessionId);
      localStorage.setItem('username', username);
      return true;
    } catch {
      return false;
    }
  };

  const signup = async (username: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      setToken(data.token);
      setSessionId(data.sessionId);
      setUsername(username);
      localStorage.setItem('token', data.token);
      localStorage.setItem('sessionId', data.sessionId);
      localStorage.setItem('username', username);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setSessionId(null);
    setUsername(null);
    localStorage.removeItem('token');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('username');
  };

  return (
    <AuthContext.Provider value={{ token, sessionId, username, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}; 