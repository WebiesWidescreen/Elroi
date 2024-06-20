import { createSelector } from "reselect";

const ListDashboard = (state) => state.dashboard;

export const selectDashboardListArr = createSelector(
  [ListDashboard],
  (dashboard) => dashboard.dashboardListArr
);

export const selectDashboardResp = createSelector(
  [ListDashboard],
  (dashboard) => dashboard.dashboardListResponse
);

export const selectPropertyAddResp = createSelector(
  [ListDashboard],
  (dashboard) => dashboard.propertyAddResponse
);
