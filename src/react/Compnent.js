import { REACT_COMPONENT } from "./constant";
import { findDOM, compareTwoVdom } from "./react-dom";
import { isFunction } from "./utils";
export const updateQueue = {
  isBatchingUpdate: false, // 当前是否处于批量更新模式
  updaters: new Set(), // 当前更新队列中保存的所有的updater实例，每个updater实例对应一个组件
  batchUpdate() {
    updateQueue.isBatchingUpdate = false;
    // 批量更新的方法

    for (const updater of updateQueue.updaters) {
      updater.updateComponent();
    }
    updateQueue.updaters.clear();
  },
};
class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;
    this.pendingStates = [];
    this.callbacks = [];
  }
  addState(partialState, cb) {
    this.pendingStates.push(partialState);
    cb && this.callbacks.push(cb);
    this.emitUpdate();
  }
  emitUpdate(nextProps) {
    this.nextProps = nextProps;
    if (updateQueue.isBatchingUpdate) {
      // 添加updater实例 到队列中，并不会进行实例的更新
      updateQueue.updaters.add(this);
    } else {
      this.updateComponent();
    }
  }
  /**
   * 1.计算新的组件状态
   * 2.重新执行组件的render方法生成虚拟DOM
   * 3.虚拟DOM 同步到真实DOM上
   */
  updateComponent() {
    const { classInstance, pendingStates, callbacks, nextProps } = this;
    if (classInstance.constructor.getDerivedStateFromProps) {
      let newState = classInstance.constructor.getDerivedStateFromProps(
        classInstance.props,
        classInstance.state
      );
      classInstance.state = { ...classInstance.state, ...newState };
    }
    // 待更新
    if (nextProps || pendingStates.length) {
      let newState = this.getState();
      shouldUpdate(classInstance, nextProps, newState);
    }
    if (callbacks.length) {
      callbacks.forEach((callback) => callback.call(classInstance));
      callbacks.length = 0;
    }
  }
  getState() {
    const { classInstance, pendingStates } = this;
    let { state } = classInstance;
    pendingStates.forEach((nextState) => {
      if (isFunction(nextState)) {
        nextState = nextState(state);
      }
      state = { ...state, ...nextState };
    });
    pendingStates.length = 0;
    return state;
  }
}

function shouldUpdate(classInstance, nextProps, newState) {
  // 默认更新
  let willUpdate = true;
  if (
    classInstance.shouldComponentUpdate &&
    !classInstance.shouldComponentUpdate(nextProps, newState)
  ) {
    willUpdate = false;
  }
  if (willUpdate && classInstance.UNSAFE_componentWillUpdate) {
    classInstance.UNSAFE_componentWillUpdate();
  }
  if (nextProps) {
    classInstance.props = nextProps;
  }
  // 不管要不要更新， 类的实例的state都会改变，都会指向新的状态
  classInstance.state = newState;

  willUpdate && classInstance.forceUpdate();
}

export class Component {
  static isReactComponent = REACT_COMPONENT;
  constructor(props) {
    this.props = props;
    this.updater = new Updater(this);
  }
  setState(partialState, cb) {
    this.updater.addState(partialState, cb);
  }
  forceUpdate() {
    let oldRenderVdom = this.oldRenderVdom;
    // 拿到上一次的DOM

    let oldDOM = findDOM(oldRenderVdom);
    if (this.constructor.getDerivedStateFromProps) {
      let newState = this.constructor.getDerivedStateFromProps(
        this.props,
        this.state
      );
      this.state = { ...this.state, ...newState };
      if (this.UNSAFE_componentWillReceiveProps) {
        console.error(
          "Warning: Unsafe legacy lifecycles will not be called for components using new component APIs."
        );
      }
    }
    let snapShot;
    if (this.getSnapshotBeforeUpdate()) {
      snapShot = this.getSnapshotBeforeUpdate();
    }

    // 拿到最新的Vdom
    let newRenderVdom = this.render();
    compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom);
    this.oldRenderVdom = newRenderVdom;
    if (this.componentDidUpdate) {
      this.componentDidUpdate(this.props, this.state, snapShot);
    }
  }
}
