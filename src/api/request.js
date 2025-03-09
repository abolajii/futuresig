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
export const getExpenses = async () => {
  try {
    // const response = await authFuture.get("/withdraw");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
