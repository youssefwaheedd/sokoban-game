import axios from "axios";
import type { DecodedUser } from "@/constants/interfaces/game";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Auth Service - Request error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Auth Service - API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

interface AuthResponse {
  token: string;
  message: string;
  user: DecodedUser;
}

export const registerUser = async (
  email: string,
  password: string,
  username: string
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    `/auth/register`,
    { email, password, username },
    { headers: { "Content-Type": "application/json" } }
  );

  if (response.data.token) {
    localStorage.setItem("authToken", response.data.token);
  }

  return response.data;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>(
      `/auth/login`,
      { email, password },
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data.token) {
      localStorage.setItem("authToken", response.data.token);
      apiClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await apiClient.post("/auth/logout");
  } finally {
    localStorage.removeItem("authToken");
    delete apiClient.defaults.headers.common["Authorization"];
  }
};
