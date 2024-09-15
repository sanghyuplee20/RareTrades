// AuthContext.js

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username'),
  });

  useEffect(() => {
    console.log('Auth state updated:', auth); // Debugging

    if (auth.token && auth.username) {
      localStorage.setItem('token', auth.token);
      localStorage.setItem('username', auth.username);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}