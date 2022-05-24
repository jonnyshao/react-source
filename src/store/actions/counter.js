import { ADD, MINUS } from "../action-types";
function add() {
  return { type: ADD };
}
function minus() {
  return { type: MINUS };
}
function thunkAdd() {
  return function (dispatch, getState) {
    setTimeout(() => {
      dispatch(add());
    }, 1000);
  };
}
function promiseAdd() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(add());
    }, 1000);
  });
}

export default {
  add,
  minus,
  thunkAdd,
  promiseAdd,
};
