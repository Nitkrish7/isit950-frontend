import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "https://isit950-backend.vercel.app/",
  headers: {
    "Content-Type": "application/json",
    // Accept: "application/json",
  },
  // withCredentials: true, 
});

// Add this to your axios instance configuration
api.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
api.defaults.headers.common["Access-Control-Allow-Methods"] = "GET,PUT,POST,DELETE,PATCH,OPTIONS";

// Add request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("API Error:", error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("API Error: No response received");
      return Promise.reject({ message: "No response from server" });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("API Error:", error.message);
      return Promise.reject(error);
    }
  }
);

// Auth API methods
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  signup: (userData) => api.post("/auth/signup", userData),
};

// User API methods
export const userAPI = {
  getProfile: (email) => api.post("/user/fetch", { email }),
  updateProfile: (userData) => api.post("/user/update", userData),
};

// Admin API methods
export const adminAPI = {
  listUsers: () => api.get("/admin/users/list"),
  deleteUser: (email) => api.delete("/admin/user/delete", { data: { email } }),
  getUsersCount: () => api.get("/auth/users/count"),
};

export default api;
