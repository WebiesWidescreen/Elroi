import loginTypes from "./login.types";

const INITIAL_STATE = {
  userLoginResponse: null,
};

const loginReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case loginTypes.USER_LOGIN_SUCCESS:
      return {
        ...state,
        userLoginResponse: action.payload,
      };

    case loginTypes.USER_LOGIN_FAILURE:
      return {
        ...state,
        userLoginResponse: action.payload,
      };

    case loginTypes.USER_LOGIN_CHANGED:
      return { ...state, userLoginResponse: null };

    case loginTypes.SIGN_IN_LOGOUT:
      return { ...state, userLoginResponse: null };

    default:
      return state;
  }
};

export default loginReducer;
