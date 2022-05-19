import { REACT_ELEMENT, REACT_FORWARD_REF, REACT_FRAGMENT } from "./constant";
import { toVdom } from "./utils";
import { Component } from "./Compnent";
/**
 * 创建元素=>虚拟DOM
 * @param {*} type
 * @param {*} config
 * @param {*} children
 * @returns
 */

export function createElement(type, config, children) {
  let ref, key;
  if (config) {
    delete config.__self;
    delete config.__source;
    ref = config.ref; // 获取真实DOM元素
    key = config.key; // domdiff移动元素处理
    delete config.ref;
    delete config.key;
  }
  let props = {
    ...config,
  };

  const l = arguments.length;

  if (l > 3) {
    props.children = [].slice.call(arguments, 2).map(toVdom);
  } else if (l === 3) {
    props.children = toVdom(children);
  }

  return {
    $$typeof: REACT_ELEMENT,
    type,
    props,
    ref,
    key,
  };
}

export function createRef() {
  return { current: null };
}

export function forwardRef(render) {
  return {
    $$typeof: REACT_FORWARD_REF,
    render,
  };
}
const React = {
  createElement,
  Component,
  createRef,
  forwardRef,
  Fragment: REACT_FRAGMENT,
};

export default React;
