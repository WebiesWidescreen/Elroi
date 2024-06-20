import { takeLatest, put, all, call } from "redux-saga/effects";

import loginTypes from "./login.types";
import { userLogin } from "./login.services";
import {
  userLoginSuccess,
  userLoginFailure,
  userLoginChanged,
} from "./login.actions";
import { encodeJson } from "../encodeDecode";

/* USER LOGIN START */
export function* listUser({ payload }) {
  try {
    const key = "UserLoginKey";
    const jsonData = {
      FirstName: payload.firstName,
      LastName: payload.lastName,
      Email: payload.email,
      PhoneNumber: payload.phoneNumber,
      Secratekey: key,
    };
    const Data = encodeJson(jsonData, key);
    const responseData = yield call(userLogin, Data);
    if (responseData.data.statusCode === "100") {
      yield put(userLoginFailure(responseData.data));
    } else {
      yield put(userLoginSuccess(responseData.data));
    }
  } catch (error) {
    yield put(userLoginFailure(error));
  }
}

export function* loginUserReset() {
  yield put(userLoginChanged());
}

export function* onUserLoginReset() {
  yield takeLatest(loginTypes.USER_LOGIN_RESET, loginUserReset);
}

export function* onUserLoginStart() {
  yield takeLatest(loginTypes.USER_LOGIN_START, listUser);
}
/* USER LOGIN END */

export function* loginSaga() {
  yield all([call(onUserLoginStart), call(onUserLoginReset)]);
}
