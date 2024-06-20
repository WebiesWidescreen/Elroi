import dashboardTypes from "./dashboardList.types";
import { docodeResponse } from "../common/commonFun";

const INITIAL_STATE = {
  propertyAddResponse: null,
  dashboardListResponse: null,
  dashboardListArr: [],
};

const dashboardReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case dashboardTypes.PROPERTY_ADD_SUCCESS:
      return {
        ...state,
        propertyAddResponse: action.payload,
      };

    case dashboardTypes.PROPERTY_ADD_FAILURE:
      return {
        ...state,
        propertyAddResponse: action.payload,
      };

    case dashboardTypes.PROPERTY_ADD_CHANGED:
      return { ...state, propertyAddResponse: null };

    case dashboardTypes.DASHBOARD_LIST_SUCCESS:
      return {
        ...state,
        dashboardListResponse: action.payload,
        dashboardListArr: docodeResponse(action.payload, "GetPropertyListKey"),
      };

    case dashboardTypes.DASHBOARD_LIST_FAILURE:
      return {
        ...state,
        dashboardListResponse: action.payload,
        dashboardListArr: [],
      };

    case dashboardTypes.DASHBOARD_LIST_CHANGED:
      return { ...state, dashboardListResponse: null };

    default:
      return state;
  }
};

export default dashboardReducer;
