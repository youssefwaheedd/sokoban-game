/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import type { DecodedUser } from "@/constants/interfaces/game";
import {
  loginUser as loginUserService,
  logoutUser as logoutUserService,
} from "@/services/auth/authServices";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

type AuthContextType = {
  user: DecodedUser | null;
  isLoading: boolean;
  login: (token: string, userData: DecodedUser) => Promise<void>;
  logout: () => Promise<void>;
  fetchUserOnLoad: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  fetchUserOnLoad: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DecodedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const clearAuthData = useCallback(() => {
    localStorage.removeItem("authToken");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      clearAuthData();
      return null;
    }

    try {
      const res = await api.get<{ user: DecodedUser }>(`/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data.user);
      setIsAuthenticated(true);
      return res.data.user;
    } catch (error) {
      console.error("Error fetching user:", error);
      clearAuthData();
      return null;
    }
  }, [clearAuthData]);

  const fetchUserOnLoad = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setIsLoading(false);
        return;
      }

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const user = await fetchCurrentUser();

      if (!user) {
        clearAuthData();
      }
    } catch (error) {
      console.error("Error fetching user on load:", error);
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  }, [fetchCurrentUser, clearAuthData]);

  useEffect(() => {
    fetchUserOnLoad();
  }, [fetchUserOnLoad]);

  const login = useCallback(
    async (token: string, userData: DecodedUser) => {
      try {
        localStorage.setItem("authToken", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(userData);
        setIsAuthenticated(true);
        await fetchCurrentUser();
      } catch (error) {
        console.error("Login error:", error);
        clearAuthData();
        throw error;
      }
    },
    [fetchCurrentUser, clearAuthData]
  );

  const logout = useCallback(async () => {
    try {
      await logoutUserService();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuthData();
      navigate("/login", { replace: true });
    }
  }, [navigate, clearAuthData]);

  const contextValue = useMemo(
    () => ({
      user,
      isLoading,
      login,
      logout,
      fetchUserOnLoad,
    }),
    [user, isLoading, login, logout, fetchUserOnLoad]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
