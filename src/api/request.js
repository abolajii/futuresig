import { authFuture, noauthFuture } from ".";

export const logInDashboard = async (data) => {
  try {
    const response = await noauthFuture.post("/login", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getRevenue = async () => {
  try {
    const response = await authFuture.get("/revenue");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getAllDeposits = async () => {
  try {
    const response = await authFuture.get("/deposit");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getWithdrawal = async () => {
  try {
    const response = await authFuture.get("/withdrawal");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteDeposit = async (id) => {
  try {
    const response = await authFuture.delete(`/deposit/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteWithdrawal = async (id) => {
  try {
    const response = await authFuture.delete(`/delete/withdrawal/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getStats = async () => {
  try {
    const response = await authFuture.get("/signal/stats");
    return response.data;
  } catch (error) {
    console.log(error);
    // throw error.response.data;
  }
};

export const addDeposit = async (data) => {
  try {
    const response = await authFuture.post("/add/deposit", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const verifyMe = async () => {
  const data = {
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
  };

  try {
    const response = await authFuture.post("/auth/verify", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getSignalForTheDay = async () => {
  try {
    const response = await authFuture.get("/signal");
    return response.data;
  } catch (error) {
    console.log(error);
    // throw error.response.data;
  }
};
