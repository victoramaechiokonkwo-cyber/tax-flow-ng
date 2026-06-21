import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('taxflow_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    const mockUser = {
      id: 1,
      name: 'Admin User',
      email,
      role: 'Tax Officer',
      institution: 'Federal Ministry of Finance'
    };
    setUser(mockUser);
    localStorage.setItem('taxflow_user', JSON.stringify(mockUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taxflow_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}