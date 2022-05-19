import { updateQueue } from "./Compnent";
/**
 * DOM元素绑定合成事件，在合成事件处理函数中调用用户自定义handler
 * @param {*} dom
 * @param {*} eventType
 * @param {*} handler
 */
export function addEvent(dom, eventType, handler) {
  // dom挂载_store_
  let store = (dom._store_ ||= {});
  //   store.onclick = handleClick
  store[eventType] = handler;
  if (!document[eventType]) {
    // document.onclick = dispatchEvent
    document[eventType] = dispatchEvent;
  }
}
/**
 * 委托给document文档对象的处理函数
 * @param {*} event
 */
function dispatchEvent(event) {
  // 事件名称 click 和事件源
  const { type, target } = event;
  const eventType = `on${type}`; // onClick
  updateQueue.isBatchingUpdate = true;
  let syntheticEvent = createSyntheticEvent(event);
  let currentTarget = target;
  //   模拟事件冒泡
  while (currentTarget) {
    syntheticEvent.currentTarget = currentTarget;
    let { _store_ } = currentTarget;
    let handler = _store_ && _store_[eventType];
    handler && handler(syntheticEvent);
    if (syntheticEvent.isPropogationStopped) {
      break;
    }
    currentTarget = currentTarget.parentNode;
  }

  updateQueue.batchUpdate();
}

function createSyntheticEvent(nativeEvent) {
  let syntheticEvent = {};
  for (let key in nativeEvent) {
    let value = nativeEvent[key];
    if (typeof value === "function") {
      value = value.bind(nativeEvent);
      syntheticEvent[key] = value;
    }
  }
  syntheticEvent.nativeEvent = nativeEvent;
  syntheticEvent.isPropogationStopped = false; // 是否已阻止冒泡
  syntheticEvent.isDefaultPrevented = false; // 是否已经阻止了默认事件
  syntheticEvent.preventDefault = preventDefault;
  syntheticEvent.stopPropagation = stopPropagtion;
  return syntheticEvent;
}
function preventDefault() {
  this.isDefaultPrevented = true;
  let event = this.nativeEvent;
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
}
function stopPropagtion() {
  this.isPropogationStopped = true;
  let event = this.nativeEvent;
  if (event.stopPropagation) {
    event.stopPropagation();
  } else {
    event.cancelBubble = false;
  }
}
