import { takeLatest, put, all, call } from "redux-saga/effects";

import dashboardTypes from "./dashboardList.types";
import { addSellerDetails, getPropertyList } from "./dashboardList.services";
import {
  propertyAddSuccess,
  propertyAddFailure,
  propertyAddChanged,
  dashboardListSuccess,
  dashboardListFailure,
  dashboardListChanged,
} from "./dashboardList.actions";
import { encodeJson } from "../encodeDecode";

/* PROPERTY ADD START */
export function* propertyAdd({ payload }) {
  try {
    const key = "PropertyAddKey";
    const jsonData = {
      UserID: payload.userID,
      Place: payload.place,
      Area: payload.area,
      NoOfBedRooms: payload.noOfBedroom,
      NoOfBathRooms: payload.noOfBathroom,
      NoOfHospitals: payload.noOfHospitalsNearBy,
      NoOfColleges: payload.noOfCollegesNearBy,
      PropertyImage: payload.housePhotos,
      Secratekey: key,
    };
    const dashboardData = encodeJson(jsonData, key);
    const responseData = yield call(addSellerDetails, dashboardData);
    if (responseData.data.statusCode === "100") {
      yield put(propertyAddFailure(responseData.data));
    } else {
      yield put(propertyAddSuccess(responseData.data));
    }
  } catch (error) {
    yield put(propertyAddFailure(error));
  }
}

export function* addPropertyReset() {
  yield put(propertyAddChanged());
}

export function* onPropertyAddReset() {
  yield takeLatest(dashboardTypes.PROPERTY_ADD_RESET, addPropertyReset);
}

export function* onPropertyAddStart() {
  yield takeLatest(dashboardTypes.PROPERTY_ADD_START, propertyAdd);
}
/* PROPERTY ADD END */

/* DASHBOARD LIST START */
export function* listDashboard({ payload }) {
  try {
    const key = "GetPropertyListKey";
    const jsonData = {
      Limit: payload.limit,
      SearchValueSet: payload.searchValueSet,
      SortBy: payload.sortBy,
      Secratekey: key,
    };
    const dashboardData = encodeJson(jsonData, key);
    const responseData = yield call(getPropertyList, dashboardData);
    if (responseData.data.statusCode === "100") {
      yield put(dashboardListFailure(responseData.data));
    } else {
      yield put(dashboardListSuccess(responseData.data));
    }
  } catch (error) {
    yield put(dashboardListFailure(error));
  }
}

export function* listDashboardReset() {
  yield put(dashboardListChanged());
}

export function* onGetDashboardListReset() {
  yield takeLatest(dashboardTypes.DASHBOARD_LIST_RESET, listDashboardReset);
}

export function* onGetDashboardList() {
  yield takeLatest(dashboardTypes.DASHBOARD_LIST_START, listDashboard);
}
/* DASHBOARD LIST END */

export function* dashboardSaga() {
  yield all([
    call(onPropertyAddStart),
    call(onPropertyAddReset),
    call(onGetDashboardList),
    call(onGetDashboardListReset),
  ]);
}
