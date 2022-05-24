import * as types from "../action-types";

let initialState = { number: 0 };

export default function counterReduer(state = initialState, action) {
  switch (action.type) {
    case types.ADD:
      return { number: state.number + 1 };
    case types.MINUS:
      return { number: state.number - 1 };
    default:
      return state;
  }
}
