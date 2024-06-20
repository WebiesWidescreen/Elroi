import dashboardTypes from "./dashboardList.types";

/* PROPERTY ADD START */
export const propertyAddStart = (propertyAddDetails) => ({
  type: dashboardTypes.PROPERTY_ADD_START,
  payload: propertyAddDetails,
});

export const propertyAddSuccess = (propertyAddListSuccess) => ({
  type: dashboardTypes.PROPERTY_ADD_SUCCESS,
  payload: propertyAddListSuccess,
});

export const propertyAddFailure = (error) => ({
  type: dashboardTypes.PROPERTY_ADD_FAILURE,
  payload: error,
});

export const propertyAddChanged = () => ({
  type: dashboardTypes.PROPERTY_ADD_CHANGED,
});

export const propertyAddReset = () => ({
  type: dashboardTypes.PROPERTY_ADD_RESET,
});
/* PROPERTY ADD END */

/* DASHBOARD LIST START */
export const dashboardListStart = (dashboardListDetails) => ({
  type: dashboardTypes.DASHBOARD_LIST_START,
  payload: dashboardListDetails,
});

export const dashboardListSuccess = (dashboardListListSuccess) => ({
  type: dashboardTypes.DASHBOARD_LIST_SUCCESS,
  payload: dashboardListListSuccess,
});

export const dashboardListFailure = (error) => ({
  type: dashboardTypes.DASHBOARD_LIST_FAILURE,
  payload: error,
});

export const dashboardListChanged = () => ({
  type: dashboardTypes.DASHBOARD_LIST_CHANGED,
});

export const dashboardListReset = () => ({
  type: dashboardTypes.DASHBOARD_LIST_RESET,
});
/* DASHBOARD LIST END */
