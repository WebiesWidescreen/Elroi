import loginTypes from "./login.types";

/* USER LOGIN START */
export const userLoginStart = (userLoginDetails) => ({
  type: loginTypes.USER_LOGIN_START,
  payload: userLoginDetails,
});

export const userLoginSuccess = (userLoginListSuccess) => ({
  type: loginTypes.USER_LOGIN_SUCCESS,
  payload: userLoginListSuccess,
});

export const userLoginFailure = (error) => ({
  type: loginTypes.USER_LOGIN_FAILURE,
  payload: error,
});

export const userLoginChanged = () => ({
  type: loginTypes.USER_LOGIN_CHANGED,
});

export const userLoginReset = () => ({
  type: loginTypes.USER_LOGIN_RESET,
});
/* USER LOGIN END */

export const logOut = () => ({
  type: loginTypes.SIGN_IN_LOGOUT,
});
