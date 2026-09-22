import { createContext, useContext, useEffect, useState } from 'react';
import { login as loginRequest } from '../api';
import { useConfig } from './ConfigContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { apiBase } = useConfig();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  // Hydrate from a previous session on first load.
  useEffect(() => {
    const storedUser = localStorage.getItem('spend_tracker_user');
    const storedToken = localStorage.getItem('spend_tracker_token');
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
    setReady(true);
  }, []);

  async function login({ email, firstName, lastName }) {
    const result = await loginRequest(apiBase, {
      email,
      first_name: firstName,
      last_name: lastName,
    });

    // The login contract may or may not include a session token depending
    // on how /auth/login is implemented server-side; handle both.
    const nextUser = result.user || { email, first_name: firstName, last_name: lastName };
    const nextToken = result.token || result.access_token || null;

    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem('spend_tracker_user', JSON.stringify(nextUser));
    if (nextToken) localStorage.setItem('spend_tracker_token', nextToken);
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('spend_tracker_user');
    localStorage.removeItem('spend_tracker_token');
  }

  return (
    <AuthContext.Provider value={{ user, token, ready, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
