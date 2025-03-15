import axios from "axios";

const prod = true;

const baseURL = prod
  ? "https://sigfuturebe.vercel.app/api/v1"
  : "http://localhost:4300/api/v1";

const getToken = () => {
  return localStorage.getItem("accessToken");
};

// Create axios instances
const authFuture = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  },
});

const noauthFuture = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
authFuture.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
authFuture.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get refresh token
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          // If no refresh token, redirect to login (or handle appropriately)
          // You may want to use your app's router here instead
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // Call verify endpoint to get a new access token
        const response = await axios.post(
          "https://sigfuturebe.vercel.app/api/v1/auth/verify",
          {
            accessToken: localStorage.getItem("accessToken"),
            refreshToken: refreshToken,
          }
        );

        // If successful, update the token and retry
        if (response.data.accessToken) {
          localStorage.setItem("accessToken", response.data.accessToken);

          // Update the authorization header
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${response.data.accessToken}`;

          // Retry the original request
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login or handle appropriately
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // You may want to use your app's router here instead
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // For errors other than 401, just reject
    return Promise.reject(error);
  }
);

// Optional: Add basic interceptors to the noauth instance too
noauthFuture.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export { authFuture, noauthFuture };
