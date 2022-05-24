import { ADD, MINUS } from "../action-types";
function add() {
  return { type: ADD };
}
function minus() {
  return { type: MINUS };
}

export default {
  add,
  minus,
};
