import axios from "axios";

const api = axios.create({
  baseURL: "https://isit950-middleware.vercel.app/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

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

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      console.error("API Error: No response received");
      return Promise.reject({ message: "No response from server" });
    } else {
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
  listHotels: () => api.get("/hotels/list"),
};

// Admin API methods
export const adminAPI = {
  listUsers: () => api.get("/admin/users/list"),
  deleteUser: (email) => api.delete("/admin/user/delete", { data: { email } }),
  getUsersCount: () => api.get("/admin/users/count"),
  getHotelsCount: () => api.get("/admin/hotels/count"),
  createHotel: (hotelData) => api.post("/admin/hotel/create", hotelData),
};

export default api;
