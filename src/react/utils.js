import { REACT_TEXT } from "./constant";

export function toVdom(element) {
  return typeof element === "string" || typeof element === "number"
    ? { type: REACT_TEXT, props: element }
    : element;
}

export function isFunction(val) {
  return typeof val === "function";
}
/**
 * 对象浅比较是否相等
 * @param {*} o1
 * @param {*} o2
 */
export function shallowEqual(o1, o2) {
  if (o1 === o2) return true;
  if (
    typeof o1 !== "object" ||
    o1 == null ||
    typeof o2 !== "object" ||
    o2 == null
  ) {
    return false;
  }

  let o1Keys = Object.keys(o1);
  let o2Keys = Object.keys(o2);
  if (o1Keys.length !== o2Keys.length) return false;
  for (let key of o1Keys) {
    if (!o2.hasOwnProperty(key) || o1[key] !== o2[key]) return false;
  }
  return true;
}
