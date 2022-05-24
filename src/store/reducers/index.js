import counter from "../reducers/counter";
import user from "../reducers/user";
import { combineReducers } from "../../redux";

export default combineReducers({
  counter,
  user,
});
