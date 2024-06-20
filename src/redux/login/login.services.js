import axios from "axios";
import { API_URL } from "../const";

export const userLogin = (postListValue) => {
  const data = {
    UserLoginData: postListValue,
  };
  const url = `${API_URL}UserLogin`;
  return axios.post(url, data, {
    headers: { "Content-type": "application/json" },
  });
};
