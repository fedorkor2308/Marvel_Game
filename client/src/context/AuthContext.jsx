import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    const token = localStorage.getItem('accessToken');
    if (saved && token) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  async function login(email, password) {
    const { data } = await authApi.login({ email, password });
    _persist(data);
    return data.user;
  }

  async function register(username, email, password) {
    const { data } = await authApi.register({ username, email, password });
    _persist(data);
    return data.user;
  }

  function logout() {
    localStorage.clear();
    setUser(null);
  }

  function _persist({ accessToken, refreshToken, user }) {
    localStorage.setItem('accessToken',  accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user',         JSON.stringify(user));
    setUser(user);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
