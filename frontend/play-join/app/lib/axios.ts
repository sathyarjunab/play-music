// lib/axios.ts
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  console.log(config);

  const c = config as typeof config & { skipAuth?: boolean };

  if (!c.skipAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      c.headers.set("Authorization", `Bearer ${token}`);
    }
  }
  return c;
});

export default api;
