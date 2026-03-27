import axios from "axios";

// Create axios instance with relative baseURL
// Since frontend and backend are now served from the same domain
const instance = axios.create({
  baseURL: "/api",     // Important: Use relative path "/api"
  timeout: 10000,      // Optional: 10 seconds timeout
});

// Request Interceptor - Add token automatically
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (optional but recommended)
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // You can handle global errors here (like token expired)
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      // Optional: redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
