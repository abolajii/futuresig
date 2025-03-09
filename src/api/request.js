import { authFuture } from ".";

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
