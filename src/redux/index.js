/**
 * reducer 
 */
import { combineReducers } from "redux";
import ecommerceReducer from "./ecommerceReducer";
import appSettings from "./appSettings";
import Auth from './auth/reducer';

const reducers = combineReducers({
  ecommerce: ecommerceReducer,
  appSettings,
  Auth
})

export default reducers;