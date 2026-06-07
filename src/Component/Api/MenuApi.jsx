import axios from "axios";
import { API_URL } from "../Server/Server";

export const fetchAllMenus = async () => {
  try {
    const res = await axios.get(`${API_URL}menu/getAllMenu`);
      return res.data.data;
  } catch (error) {
    return [];
  }
};
