// lib/axios.ts
import axios, { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const c = config as typeof config & { skipAuth?: boolean };
  if (!c.skipAuth) {
    const token = localStorage.getItem("Token");
    if (token) {
      c.headers.set("authorization", `Bearer ${token}`);
    }
    c.withCredentials = true;
  }
  return c;
});

export default api;
