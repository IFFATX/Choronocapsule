import axios from "axios";

// Backend base URL
const BASE_URL = "http://localhost:5001/api/auth";

export const registerUser = async (userData) => {
  try {
    const res = await axios.post(`${BASE_URL}/register`, userData);
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const loginUser = async (userData) => {
  try {
    const res = await axios.post(`${BASE_URL}/login`, userData);
    return res.data;
  } catch (err) {
    throw err;
  }
};



