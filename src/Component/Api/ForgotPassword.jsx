import axios from "axios";
import { API_URL } from "../Server/Server";

export const sendOtpApi = async (email) => {
  return await axios.post(
    `${API_URL}user/send-otp`,
    { email },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const verifyOtpApi = async (email, otp) => {
  return await axios.post(
    `${API_URL}user/verify-otp`,
    {
      email,
      otp,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const newPassword = async (email, newPassword) => {
  return await axios.post(
    `${API_URL}user/forgot-password/new-password`,
    {
      email,
      newPassword,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
