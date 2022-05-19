import {
  REACT_CONTEXT,
  REACT_ELEMENT,
  REACT_FORWARD_REF,
  REACT_FRAGMENT,
  REACT_MEMO,
  REACT_PROVIDER,
} from "./constant";
import { shallowEqual, toVdom } from "./utils";
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

export function createContext() {
  let context = {
    $$typeof: REACT_CONTEXT,
    _currentValue: undefined,
  };
  context.Provider = {
    $$typeof: REACT_PROVIDER,
    _context: context,
  };
  context.Consumer = {
    $$typeof: REACT_CONTEXT,
    _context: context,
  };
  return context;
}

export function cloneElement(element, newProps, ...newChildren) {
  let oldChildren = element.props && element.props.children;

  let children = [
    ...(Array.isArray(oldChildren) ? oldChildren : [oldChildren]),
    ...newChildren,
  ]
    .filter((item) => item != null)
    .map(toVdom);
  if (children.length === 1) children = children[0];
  let props = { ...element.props, ...newProps, children };
  return {
    ...element,
    props,
  };
}

function memo(type, compare = null) {
  return {
    $$typeof: REACT_MEMO,
    compare,
    type,
  };
}

class PureComponent extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      !shallowEqual(this.props, nextProps) ||
      !shallowEqual(this.state, nextState)
    );
  }
}

const React = {
  createElement,
  Component,
  createRef,
  forwardRef,
  Fragment: REACT_FRAGMENT,
  createContext,
  cloneElement,
  PureComponent,
  memo,
};

export default React;
