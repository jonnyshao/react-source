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
  if (eventType == "onchange") eventType = "oninput";
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
  let { target, type } = event;
  let eventType = `on${type}`;
  let syntheticEvent = createSyntheticEvent(event);
  updateQueue.isBatchingUpdate = true;
  while (target) {
    let { _store_ } = target;

    let handler = _store_ && _store_[eventType];
    handler && handler(syntheticEvent);
    //在执行handler的过程中有可能会阻止冒泡
    if (syntheticEvent.isPropagationStopped) {
      break;
    }
    target = target.parentNode;
  }
  updateQueue.batchUpdate();
  // const { type, target } = event;
  // console.log(type, target);
  // const eventType = `on${type}`; // onClick
  // updateQueue.isBatchingUpdate = true;
  // let syntheticEvent = createSyntheticEvent(event);
  // let currentTarget = target;
  // //   模拟事件冒泡
  // while (currentTarget) {
  //   syntheticEvent.currentTarget = currentTarget;
  //   let { _store_ } = currentTarget;
  //   let handler = _store_ && _store_[eventType];
  //   handler && handler(syntheticEvent);
  //   if (syntheticEvent.isPropogationStopped) {
  //     break;
  //   }
  //   currentTarget = currentTarget.parentNode;
  // }

  // updateQueue.batchUpdate();
}

function createSyntheticEvent(nativeEvent) {
  let syntheticEvent = {};
  for (let key in nativeEvent) {
    //把原生事件上的属性拷贝到合成事件对象上去
    let value = nativeEvent[key];
    if (typeof value === "function") value = value.bind(nativeEvent);
    syntheticEvent[key] = nativeEvent[key];
  }
  syntheticEvent.nativeEvent = nativeEvent;
  syntheticEvent.isDefaultPrevented = false;
  syntheticEvent.isPropagationStopped = false;
  syntheticEvent.preventDefault = preventDefault;
  syntheticEvent.stopPropagation = stopPropagation;
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
function stopPropagation() {
  this.isPropogationStopped = true;
  let event = this.nativeEvent;
  if (event.stopPropagation) {
    event.stopPropagation();
  } else {
    event.cancelBubble = false;
  }
}
