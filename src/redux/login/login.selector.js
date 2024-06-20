import { createSelector } from "reselect";

const UserLogin = (state) => state.login;

export const selectUserLoginResp = createSelector(
  [UserLogin],
  (login) => login.userLoginResponse
);
