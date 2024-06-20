import { all, call } from "redux-saga/effects";
import { loginSaga } from "./login/login.saga";
import { dashboardSaga } from "./dashboard/dashboardList.saga";

export default function* rootSaga() {
  yield all([call(loginSaga), call(dashboardSaga)]);
}
