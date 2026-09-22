import { createContext, useContext, useState } from 'react';

const DEFAULT_API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000';

const ConfigContext = createContext(null);

export function ConfigProvider({ children }) {
  const [apiBase, setApiBaseState] = useState(
    () => localStorage.getItem('spend_tracker_api_base') || DEFAULT_API_BASE
  );

  function setApiBase(value) {
    setApiBaseState(value);
    localStorage.setItem('spend_tracker_api_base', value);
  }

  return (
    <ConfigContext.Provider value={{ apiBase, setApiBase }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('useConfig must be used within ConfigProvider');
  return ctx;
}
