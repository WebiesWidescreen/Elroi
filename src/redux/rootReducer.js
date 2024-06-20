import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import loginReducer from "./login/login.reducer";
import dashboardReducer from "./dashboard/dashboardList.reducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["login"],
};
const rootReducer = combineReducers({
  login: loginReducer,
  dashboard: dashboardReducer,
});

export default persistReducer(persistConfig, rootReducer);
