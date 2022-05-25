// import counter from "../reducers/counter";
// import user from "../reducers/user";
// import { combineReducers } from "../../redux";

// export default combineReducers({
//   counter,
//   user,
// });

import { combineReducers } from 'redux';
import counter from './counter';
import { routerReducer } from '../../history';
const reducers = {
  counter,
  router: routerReducer,
};
export default combineReducers(reducers);
