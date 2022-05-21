import {
  REACT_COMPONENT,
  REACT_ELEMENT,
  REACT_FORWARD_REF,
  REACT_TEXT,
  REACT_FRAGMENT,
  MOVE,
  PLACEMENT,
  REACT_PROVIDER,
  REACT_CONTEXT,
  REACT_MEMO,
} from "./constant";
import { addEvent } from "./event";
import { isFunction, shallowEqual } from "./utils";
/**
 * 根据虚拟DOM获取真实DOM
 * @param {*} vdom
 */

export function findDOM(vdom) {
  if (!vdom) return null;
  if (vdom.dom) return vdom.dom;
  let renderVdom = vdom.classInstance
    ? vdom.classInstance.oldRenderVdom
    : vdom.oldRenderVdom;
  return findDOM(renderVdom);
}
export function compareTwoVdom(parentDom, oldVdom, newVdom, nextDom) {
  if (!oldVdom && !newVdom) {
    //老和新的节点都没有
    return;
  } else if (oldVdom && !newVdom) {
    //老节点有新节点没有
    unMountVdom(oldVdom);
  } else if (!oldVdom && newVdom) {
    //老没有新的有
    let newDOM = createDOM(newVdom);
    if (nextDom) parentDom.insertBefore(newDOM, nextDom);
    else parentDom.appendChild(newDOM);
    if (newDOM.componentDidMount) newDOM.componentDidMount();
    return;
  } else if (oldVdom && newVdom && oldVdom.type !== newVdom.type) {
    //新老都有，但类型不同
    let newDOM = createDOM(newVdom);
    unMountVdom(oldVdom);
    if (newDOM.componentDidMount) newDOM.componentDidMount();
  } else {
    updateElement(oldVdom, newVdom);
  }
}

/**
 * 新老虚拟DOM深度对比
 * @param {*} oldVdom
 * @param {*} newVdom
 */
function updateElement(oldVdom, newVdom) {
  if (oldVdom.type.$$typeof === REACT_MEMO) {
    updateMemoComponent(oldVdom, newVdom);
  } else if (oldVdom.type.$$typeof === REACT_CONTEXT) {
    updateContextComponent(oldVdom, newVdom);
  } else if (oldVdom.type.$$typeof === REACT_PROVIDER) {
    updateProviderCompoent(oldVdom, newVdom);
  } else if (oldVdom.type === REACT_TEXT) {
    // 如果是文本 更新文本内容
    let currentDOM = (newVdom.dom = findDOM(oldVdom));
    if (oldVdom.props !== newVdom.props) {
      currentDOM.textContent = newVdom.props;
    }
  } else if (typeof oldVdom.type == "string") {
    let currentDOM = (newVdom.dom = findDOM(oldVdom));
    updateProps(currentDOM, oldVdom.props, newVdom.props);
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
  } else if (oldVdom.type === REACT_FRAGMENT) {
    let currentDOM = (newVdom.dom = findDOM(oldVdom));
    updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children);
  } else if (isFunction(oldVdom.type)) {
    if (oldVdom.type.isReactComponent == REACT_COMPONENT) {
      updateClassComponent(oldVdom, newVdom);
    } else {
      updateFunctionComponent(oldVdom, newVdom);
    }
  }
}

function updateMemoComponent(oldVdom, newVdom) {
  let { type, prevProps } = oldVdom;
  type.compare ||= shallowEqual;
  // 如果浅比较相等 直接复用oldVdom
  if (type.compare(prevProps, newVdom.props)) {
    newVdom.prevProps = prevProps;
    newVdom.oldRenderVdom = oldVdom.oldRenderVdom;
  } else {
    let parentDom = findDOM(oldVdom).parentNode;
    let { type, props } = newVdom;
    let renderVdom = type.type(props);
    compareTwoVdom(parentDom, oldVdom.renderVdom, newVdom.renderVdom);
    newVdom.prevProps = props;
    newVdom.oldRenderVdom = renderVdom;
    return createDOM(renderVdom);
  }
}

function updateContextComponent(oldVdom, newVdom) {
  let parentDom = findDOM(oldVdom).parentNode;

  let { type, props } = newVdom;
  let context = type._context;
  let renderVdom = props.children(context._currentValue);

  compareTwoVdom(parentDom, oldVdom.oldRenderVdom, renderVdom);
  newVdom.oldRenderVdom = renderVdom;
}
function updateProviderCompoent(oldVdom, newVdom) {
  let parentDom = findDOM(oldVdom).parentNode;

  let { type, props } = newVdom;
  let context = type._context;
  context._currentValue = props.value;
  let renderVdom = props.children;

  compareTwoVdom(parentDom, oldVdom.oldRenderVdom, renderVdom);
  newVdom.oldRenderVdom = renderVdom;
}
/**
 * 更新子节点
 * @param {*} parentDOM 父节点真实DOM
 * @param {*} oldVChildren 老的子节点虚拟DOM数组
 * @param {*} newVChildren 新的子节点虚拟DOM数组
 */
function updateChildren(parentDOM, oldVChildren, newVChildren) {
  oldVChildren = (
    Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren]
  ).filter((item) => item != null);
  newVChildren = (
    Array.isArray(newVChildren) ? newVChildren : [newVChildren]
  ).filter((item) => item != null);
  // 构建一个map
  const keyedOldMap = {};
  let lastPlacedIndex = 0;

  oldVChildren.forEach((oldVdom, index) => {
    let oldKey = oldVdom.key ? oldVdom.key : index;
    keyedOldMap[oldKey] = oldVdom;
  });

  // 创建一个DOM 补丁包 收集DOM操作
  const patch = [];
  newVChildren.forEach((newVdom, index) => {
    newVdom.mountIndex = index;
    let newKey = newVdom.key ? newVdom.key : index;

    let oldVdom = keyedOldMap[newKey];
    // 如果存在老节点

    if (oldVdom) {
      updateElement(oldVdom, newVdom);
      // 老节点挂载索引小于上一次移动的索引
      if (oldVdom.mountIndex < lastPlacedIndex) {
        patch.push({
          type: MOVE,
          oldVdom,
          newVdom,
          mountIndex: index,
        });
      }
      // 老节点复用过删除
      delete keyedOldMap[newKey];
      lastPlacedIndex = Math.max(lastPlacedIndex, oldVdom.mountIndex);
    } else {
      patch.push({
        type: PLACEMENT,
        newVdom,
        mountIndex: index,
      });
    }
  });

  let moveVChildren = patch
    .filter((action) => action.type === MOVE)
    .map((action) => action.oldVdom);
  // keyedOldMap 未被复用的老节点连接上 需要移动的节点 全部删除
  Object.values(keyedOldMap)
    .concat(moveVChildren)
    .forEach((oldVChild) => {
      let currentDOM = findDOM(oldVChild);
      currentDOM.remove();
    });

  if (patch.length) {
    patch.forEach((action) => {
      let { type, oldVdom, newVdom, mountIndex } = action;
      // 老的真实子DOM节点集合
      let childNodes = parentDOM.childNodes;
      if (type === PLACEMENT) {
        let newDom = createDOM(newVdom);
        let childNode = childNodes[mountIndex];
        if (childNode) {
          parentDOM.insertBefore(newDom, childNode);
        } else {
          parentDOM.appendChild(newDom);
        }
      } else if (type === MOVE) {
        let oldDom = findDOM(oldVdom);
        let childNode = childNodes[mountIndex];
        if (childNode) {
          parentDOM.insertBefore(oldDom, childNode);
        } else {
          parentDOM.appendChild(oldDom);
        }
      }
    });
  }

  // let maxLen = Math.max(oldVChildren.length, newVChildren.length);
  // for (let i = 0; i < maxLen; i++) {
  //   let nextVdom = oldVChildren.find(
  //     (item, index) => index > i && item && findDOM(item)
  //   );
  //   compareTwoVdom(
  //     parentDOM,
  //     oldVChildren[i],
  //     newVChildren[i],
  //     findDOM(nextVdom)
  //   );
  // }
}

/**
 * 根据虚拟DOM 删除真实节点
 * @param {*} vdom
 */
function unMountVdom(vdom) {
  let { type, props, ref, classInstance } = vdom;
  let currentDOM = findDOM(vdom); //获取此虚拟DOM对应的真实DOM

  //vdom可能是原生组件span 类组件 classComponent 也可能是函数组件Function
  if (classInstance && classInstance.componentWillUnmount) {
    classInstance.componentWillUnmount();
  }
  if (ref) ref.current = null;
  if (props.children) {
    let children = (
      Array.isArray(props.children) ? props.children : [props.children]
    ).filter((item) => item != null);
    children.forEach(unMountVdom);
  }

  currentDOM && currentDOM.parentNode.removeChild(currentDOM);
}
function render(vdom, container) {
  mount(vdom, container);
}

function updateClassComponent(oldVdom, newVdom) {
  const classInstance = (newVdom.classInstance = oldVdom.classInstance);

  if (classInstance.UNSAFE_componentWillReceiveProps) {
    classInstance.UNSAFE_componentWillReceiveProps();
  }
  classInstance.updater.emitUpdate(newVdom.props);
}

function updateFunctionComponent(oldVdom, newVdom) {
  let currentDOM = findDOM(oldVdom);
  if (!currentDOM) return;
  let { type, props } = newVdom;
  let newRenderVdom = type(props);
  compareTwoVdom(currentDOM.parentNode, oldVdom.oldRenderVdom, newRenderVdom);
  newVdom.oldRenderVdom = newRenderVdom;
}

/**
 * 虚拟DOM渲染成真实DOM
 * @param {*} vdom
 * @param {*} container
 */
function mount(vdom, container) {
  let newDom = createDOM(vdom);
  if (newDom) {
    container.appendChild(newDom);
    newDom.componentDidMount && newDom.componentDidMount();
  }
}
function createDOM(vdom) {
  let { type, props, ref } = vdom;
  let dom;
  if (type && type.$$typeof === REACT_MEMO) {
    return mountMemoComponent(vdom);
  } else if (type && type.$$typeof === REACT_PROVIDER) {
    return mountProviderComponent(vdom);
  } else if (type && type.$$typeof === REACT_CONTEXT) {
    return mountContextComponent(vdom);
  } else if (type.$$typeof == REACT_FORWARD_REF) {
    return mountForwardComponent(vdom);
  } else if (type === REACT_TEXT) {
    dom = document.createTextNode(props);
  } else if (type === REACT_FRAGMENT) {
    dom = document.createDocumentFragment();
  } else if (typeof type === "function") {
    return type.isReactComponent === REACT_COMPONENT
      ? mountClassComponent(vdom)
      : mountFunctionComponent(vdom);
  } else {
    dom = document.createElement(type);
  }
  if (typeof props == "object") {
    updateProps(dom, {}, props);
    if (typeof props.children == "object" && props.children.type) {
      props.children.mountIndex = 0;
      mount(props.children, dom);
    } else if (Array.isArray(props.children)) {
      reconcileChildren(props.children, dom);
    }
  }

  vdom.dom = dom;
  if (ref) ref.current = dom;
  return dom;
}

function mountMemoComponent(vdom) {
  let { type, props } = vdom;
  let renderVdom = type.type(props);
  vdom.prevProps = props;
  vdom.oldRenderVdom = renderVdom;
  if (!renderVdom) return null;
  return createDOM(renderVdom);
}

function mountProviderComponent(vdom) {
  let { type, props } = vdom;
  let context = type._context;
  // 赋值
  context._currentValue = props.value;
  let renderVdom = props.children;
  if (!renderVdom) return null;
  vdom.oldRenderVdom = renderVdom;

  return createDOM(renderVdom);
}
function mountContextComponent(vdom) {
  let { type, props } = vdom;
  let context = type._context;

  let renderVdom = props.children(context._currentValue);

  vdom.oldRenderVdom = renderVdom;
  if (!renderVdom) return null;
  return createDOM(renderVdom);
}

function mountClassComponent(vdom) {
  let { type: ClassComponent, props, ref } = vdom;
  // 创建类组件实例
  let classInstance = new ClassComponent(props);
  if (ClassComponent.contextType) {
    classInstance.context = ClassComponent.contextType._currentValue;
  }
  vdom.classInstance = classInstance;
  // 组件将要挂载

  if (classInstance.constructor.getDerivedStateFromProps) {
    let newState = classInstance.constructor.getDerivedStateFromProps(
      classInstance.props,
      classInstance.state
    );
    classInstance.state = { ...classInstance.state, ...newState };
    if (classInstance.UNSAFE_componentWillMount) {
      console.error(
        "Warning: Unsafe legacy lifecycles will not be called for components using new component APIs."
      );
    }
  } else if (classInstance.UNSAFE_componentWillMount) {
    classInstance.UNSAFE_componentWillMount();
  }
  if (ref) ref.current = classInstance;
  let renderVdom = classInstance.render();

  // 把类组件渲染的虚拟DOM放到类的实例上
  classInstance.oldRenderVdom = renderVdom;
  if (!renderVdom) return null;
  let dom = createDOM(renderVdom);

  // 挂载处理
  if (classInstance.componentDidMount) {
    dom.componentDidMount = classInstance.componentDidMount.bind(classInstance);
  }
  return dom;
}

function mountFunctionComponent(vdom) {
  let { type, props } = vdom;
  let renderVdom = type(props);
  // 把函数组件渲染的虚拟DOM放在了函数组件自己的虚拟DOM上
  vdom.oldRenderVdom = renderVdom;
  if (!renderVdom) return null;
  return createDOM(renderVdom);
}
function mountForwardComponent(vdom) {
  let { type, props, ref } = vdom;
  let renderVdom = type.render(props, ref);
  vdom.oldRenderVdom = renderVdom;
  if (!renderVdom) return null;
  return createDOM(renderVdom);
}

function reconcileChildren(childrenVdom, parentDom) {
  for (let i = 0; i < childrenVdom.length; i++) {
    childrenVdom[i].mountIndex = i;
    mount(childrenVdom[i], parentDom);
  }
}
/**
 * 属性更新同步到真实DOM上
 * @param {*} dom
 * @param {*} oldProps
 * @param {*} newProps
 */
function updateProps(dom, oldProps, newProps) {
  for (const key in newProps) {
    if (key === "children") continue;
    if (newProps.hasOwnProperty(key)) {
      if (key === "style") {
        let styleObj = newProps[key];
        for (let attr in styleObj) {
          dom.style[attr] = styleObj[attr];
        }
      } else if (/^on[A-Z].*/.test(key)) {
        addEvent(dom, key.toLowerCase(), newProps[key]);
      } else {
        dom[key] = newProps[key];
      }
    }
  }
  for (const key in oldProps) {
    if (!newProps.hasOwnProperty(key)) {
      delete dom[key];
    }
  }
}

const ReactDOM = {
  render,
  createPortal: render,
};

export default ReactDOM;
