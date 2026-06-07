import axios from "axios";
import { API_URL } from "../Server/Server";

// Crete Profile
export const createUserProfile = async (userId, data) => {
  return axios.post(`${API_URL}userProfile/user/${userId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// Edit Profile
export const updateUserProfile = async (profileId, data) => {
  return axios.put(`${API_URL}userProfile/user-profile/${profileId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// GET user profile
export const getUserProfile = async (userId) => {
  return axios.get(`${API_URL}userProfile/user-profile/${userId}`, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
