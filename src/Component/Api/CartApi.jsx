import axios from "axios";
import { API_URL } from "../Server/Server";
import { authHeader } from "../Utiles/authHeader";

export const fetchCoupons = async () => {
  const restaurantId = localStorage.getItem("restaurantId");
  const res = await axios.get(
    `${API_URL}coupon/fetchAll/${restaurantId}`,
    authHeader()
  );

  return res.data || [];
};
