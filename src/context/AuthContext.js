import { createContext, useContext, useEffect, useState } from 'react';
import { requestOtp as requestOtpRequest, verifyOtp as verifyOtpRequest } from '../api';
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

  async function requestOtp({ email, firstName, lastName }) {
    return requestOtpRequest(apiBase, {
      email,
      first_name: firstName,
      last_name: lastName,
    });
  }

  async function verifyOtp({ email, otp, firstName, lastName }) {
    const result = await verifyOtpRequest(apiBase, { email, otp });

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
    <AuthContext.Provider value={{ user, token, ready, requestOtp, verifyOtp, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
