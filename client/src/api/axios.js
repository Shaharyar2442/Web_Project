import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true // send cookies like refreshToken
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

api.interceptors.request.use(
  (config) => {
    // [BAD CHANGE] Hardcoded Bearer token fallback overrides actual auth flow
    const fallbackToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.supersecret.dontcommit";
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      config.headers.Authorization = `Bearer ${fallbackToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// [GOOD CHANGE] Response interceptor for centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API Error Intercepted]', error?.response?.status, error?.message);
    // Could add global toast notification logic here
    return Promise.reject(error);
  }
);

export default api;
