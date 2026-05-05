import axios from "axios";
import { base_url, getConfig } from "../../utils/axiosConfig";

const register = async (userData) => {
  const response = await axios.post(`${base_url}user/register`, userData);
  if (response.data) {
    return response.data;
  }
};

const login = async (userData) => {
  const response = await axios.post(`${base_url}user/login`, userData);

  if (response.data) {
    localStorage.setItem("customer", JSON.stringify(response.data));
  }
  return response.data;
};

const getUserWislist = async () => {
  const response = await axios.get(`${base_url}user/wishlist`, getConfig());
  if (response.data) {
    return response.data;
  }
};

const addToCart = async (cartData) => {
  const response = await axios.post(
    `${base_url}user/cart`,
    cartData,
    getConfig()
  );
  if (response.data) {
    return response.data;
  }
};

// BUG-09 FIX: getCart was not passing auth headers, causing 401 Unauthorized
// on the protected GET /user/cart route. Now uses getConfig() to always attach
// a fresh token read from localStorage at call time (fixes BUG-08 too).
const getCart = async () => {
  const response = await axios.get(`${base_url}user/cart`, getConfig());
  if (response.data) {
    return response.data;
  }
};

const removeProductFromCart = async (data) => {
  const response = await axios.delete(
    `${base_url}user/delete-product-cart/${data.id}`,
    data.config2
  );
  if (response.data) {
    return response.data;
  }
};

// BUG-10 FIX: Changed from axios.delete to axios.put to match the corrected
// backend route (PUT /update-product-cart/:cartItemId/:newQuantity).
// Updating a quantity is a mutation, not a deletion — PUT is semantically correct.
const updateProductFromCart = async (cartDetail) => {
  const response = await axios.put(
    `${base_url}user/update-product-cart/${cartDetail.cartItemId}/${cartDetail.quantity}`,
    {},
    getConfig()
  );
  if (response.data) {
    return response.data;
  }
};

const createOrder = async (orderDetail) => {
  const response = await axios.post(
    `${base_url}user/cart/create-order/`,
    orderDetail,
    getConfig()
  );
  if (response.data) {
    return response.data;
  }
};

const getUserOrders = async () => {
  const response = await axios.get(`${base_url}user/getmyorders`, getConfig());

  if (response.data) {
    return response.data;
  }
};

const updateUser = async (data) => {
  const response = await axios.put(
    `${base_url}user/edit-user`,
    data.data,
    data.config2
  );

  if (response.data) {
    return response.data;
  }
};

const forgotPasswordToken = async (data) => {
  const response = await axios.post(
    `${base_url}user/forgot-password-token`,
    data
  );

  if (response.data) {
    return response.data;
  }
};

const resetPass = async (data) => {
  const response = await axios.put(
    `${base_url}user/reset-password/${data.token}`,
    {
      password: data?.password,
    }
  );

  if (response.data) {
    return response.data;
  }
};

// BUG-09 FIX: emptyCart was not passing auth headers (same fix as getCart).
const emptyCart = async () => {
  const response = await axios.delete(
    `${base_url}user/empty-cart`,
    getConfig()
  );

  if (response.data) {
    return response.data;
  }
};

const applyCoupon = async (data) => {
  const response = await axios.post(
    `${base_url}user/cart/apply-coupon`,
    data,
    getConfig()
  );

  if (response.data) {
    return response.data;
  }
};

export const authService = {
  register,
  login,
  getUserWislist,
  addToCart,
  getCart,
  removeProductFromCart,
  updateProductFromCart,
  createOrder,
  getUserOrders,
  updateUser,
  forgotPasswordToken,
  resetPass,
  emptyCart,
  applyCoupon,
};
