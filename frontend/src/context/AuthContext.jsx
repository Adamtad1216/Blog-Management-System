import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

// Default mock authenticated author user (Seed Author)
const MOCK_AUTHOR = {
  id: '079cdd69-05d4-4c6b-b8bf-9883afe4c452',
  fullName: 'John Author',
  username: 'john_author',
  email: 'author@example.com',
  avatar: 'https://example.com/avatars/john.jpg',
  role: 'author',
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('blog_user');
    return savedUser ? JSON.parse(savedUser) : MOCK_AUTHOR;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('blog_token') || 'mock-jwt-token';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('blog_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('blog_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('blog_token', token);
    } else {
      localStorage.removeItem('blog_token');
    }
  }, [token]);

  const login = (userData, authToken = 'mock-jwt-token') => {
    setUser(userData);
    setToken(authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
