import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../services/api.js";

const AuthContext = createContext();

const TOKEN_KEY = "blog_token";
const REFRESH_TOKEN_KEY = "blog_refresh_token";
const USER_KEY = "blog_user";

function getStoredUser() {
  const savedUser = localStorage.getItem(USER_KEY);
  return savedUser ? JSON.parse(savedUser) : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [refreshToken, setRefreshToken] = useState(() =>
    localStorage.getItem(REFRESH_TOKEN_KEY),
  );
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }, [refreshToken]);

  const setAuthSession = (authData) => {
    setUser(authData.user || null);
    setToken(authData.accessToken || null);
    setRefreshToken(authData.refreshToken || null);
  };

  const clearAuthSession = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
  };

  useEffect(() => {
    const bootstrapAuth = async () => {
      if (!token) {
        setAuthReady(true);
        return;
      }

      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser || null);
      } catch (error) {
        clearAuthSession();
      } finally {
        setAuthReady(true);
      }
    };

    bootstrapAuth();
  }, [token]);

  const login = async (credentials) => {
    const authData = await loginUser(credentials);
    setAuthSession(authData || {});
    return authData?.user || null;
  };

  const register = async (payload) => {
    const authData = await registerUser(payload);
    setAuthSession(authData || {});
    return authData?.user || null;
  };

  const logout = async () => {
    try {
      if (refreshToken) {
        await logoutUser(refreshToken);
      }
    } catch (_error) {
      // Clear local session even when backend logout fails.
    } finally {
      clearAuthSession();
    }
  };

  const updateUserInContext = (updatedUserData) => {
    setUser((prev) => (prev ? { ...prev, ...updatedUserData } : updatedUserData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        refreshToken,
        authReady,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        updateUserInContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
