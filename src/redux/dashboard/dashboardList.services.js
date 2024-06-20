import axios from "axios";
import { API_URL } from "../const";

export const addSellerDetails = (postListValue) => {
  const data = {
    AddSellerDetailsData: postListValue,
  };
  const url = `${API_URL}AddSellerDetails`;
  return axios.post(url, data, {
    headers: { "Content-type": "application/json" },
  });
};

export const getPropertyList = (postListValue) => {
  const data = {
    GetPropertyListData: postListValue,
  };
  const url = `${API_URL}GetPropertyList`;
  return axios.post(url, data, {
    headers: { "Content-type": "application/json" },
  });
};
