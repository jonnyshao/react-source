import { REACT_TEXT } from "./constant";

export function toVdom(element) {
  return typeof element === "string" || typeof element === "number"
    ? { type: REACT_TEXT, props: element }
    : element;
}

export function isFunction(val) {
  return typeof val === "function";
}
