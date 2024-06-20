import JWT from "expo-jwt";

// useJwt Token Encode
export const encodeJson = (encodeData, key) =>
  JWT.encode(encodeData, key, { algorithm: "HS512" });

// useJwt Token Decode
export const decodeJson = (decodeData, key) =>
  JWT.encode(JSON.stringify(decodeData), key, { algorithm: "HS512" });

// Decode
export const decodeTokenJson = (jsonData, key) => {
  const decodedData = JWT.decode(jsonData, key);
  return decodedData;
};
