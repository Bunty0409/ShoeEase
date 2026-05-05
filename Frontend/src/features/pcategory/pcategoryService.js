import axios from "axios";
import { base_url } from "../../utils/axiosConfig";

const getCategories = async () => {
  const response = await axios.get(`${base_url}category/`);
  if (response.data) {
    return response.data;
  }
};

export const pcategoryService = {
  getCategories,
};
