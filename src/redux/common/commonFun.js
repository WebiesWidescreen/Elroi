import { decodeTokenJson } from "../encodeDecode";

export const docodeResponse = (response, key) => {
  const docodeVal = decodeTokenJson(response.response, key);
  return docodeVal.data;
};
