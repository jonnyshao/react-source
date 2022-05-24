import * as types from "../action-types";

let initialState = { name: "jonny" };

export default function counterReduer(state = initialState, action) {
  switch (action.type) {
    case types.CHANGE:
      return { name: "Ryan" };
    default:
      return state;
  }
}
