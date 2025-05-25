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
  resetPassword: ({ email, oldPassword, newPassword }) =>
    api.put("/auth/password/reset", { email, oldPassword, newPassword }),
};

// User API methods
export const userAPI = {
  getProfile: (email) => api.get(`/user/fetch/${email}`),
  updateProfile: (userData) => api.put("/user/update", userData),
  listHotels: () => api.get("/hotels/list"),
  getHotelDetails: (id) => api.get(`/hotels/fetch/${id}`),
  createReview: (reviewData) => api.post("/hotels/review/create", reviewData),
  checkRoomAvailability: (data) => api.put("/booking/availability/fetch", data),
  createBooking: (bookingData) => api.post("/booking/create", bookingData),
  listBookings: (userid) => api.get(`/booking/list/${userid}`),
  listFavourites: (userid) => api.get(`/user/favourites/fetch/${userid}`),
  searchHotels: (keywords) => api.put("/hotels/search", { keywords }),
  forgotPassword: (email) => api.put("/auth/password/forgot", { email }),
  addToFavourites: (userId, hotelId) =>
    api.post("/user/addtofavourites", { userId, hotelId }),
  removeFavourite: (favId) =>
    api.delete("/user/removefromfavourites", { data: { favId } }),
  createSubscription: (data) => api.post("/user/subscription/create", data),
  updateSubscription: (data) => api.put("/user/subscription/update", data),
  updateBooking: (data) => api.put("/booking/update", data),
  cancelBooking: (bookingId) =>
    api.delete("/booking/delete", { data: { bookingId } }),
  getNotifications: (userid) => api.get(`/notifications/fetch/${userid}`),
};

// Admin API methods
export const adminAPI = {
  listUsers: () => api.get("/admin/users/list"),
  deleteUser: (email) =>
    api.delete("/admin/user/delete", { data: { userEmail: email } }),
  getUsersCount: () => api.get("/admin/users/count"),
  getHotelsCount: () => api.get("/admin/hotels/count"),
  createHotel: (hotelData) => api.post("/admin/hotel/create", hotelData),
  requestOnboard: (data) => api.post("/admin/onboard/request", data),
  listOnboardRequests: () => api.get("/admin/onboard/request/list"),
  createRoom: (roomData) => api.post("/admin/room/create", roomData),
  updateRoom: (roomData) => api.put("/admin/room/update", roomData),
  listRooms: (hotelid) => api.get(`/rooms/list/${hotelid}`),
  getHotelIdByAdmin: (adminid) => api.get(`/hotels/id/fetch/${adminid}`),
  listBookingsByHotel: (hotelid) => api.get(`/admin/booking/list/${hotelid}`),
  getHotelDetails: (hotelid) => api.get(`/hotels/fetch/${hotelid}`),
  updateHotel: (hotelData) => api.put("/admin/hotel/update", hotelData),
  deleteRoom: (roomId) =>
    api.delete("/admin/room/delete", { data: { roomId } }),
  getHotelAdminStats: (hotelid) =>
    api.get(`/admin/hoteladmin/stats/${hotelid}`),
  getUpcomingBookings: (hotelid) =>
    api.get(`/admin/upcomingbookings/${hotelid}`),
  getSuperuserStats: () => api.get("/admin/superuser/stats"),
  rateCustomer: (userId, rating) =>
    api.post("/admin/customer/rate", { userId, rating }),
  blockRoomDates: (roomId, startDate, endDate) =>
    api.post("/admin/dates/block", { roomId, startDate, endDate }),
  getBlockedDates: (roomId, startDate, endDate) =>
    api.put("/admin/dates/blocked/get", { roomId, startDate, endDate }),
  getBookedDates: (roomId, startDate, endDate) =>
    api.put("/admin/dates/booked/get", { roomId, startDate, endDate }),
  declineBooking: (bookingId) =>
    api.delete("/admin/booking/decline", { data: { bookingId } }),
  declineOnboardRequest: (id) =>
    api.delete("/admin/onboard/delete", { data: { id } }),
};

export default api;
