import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  connect,
  Provider,
  useSelector,
  useBoundDispatch,
} from './react-redux';
import actionCreators from './store/actions/counter';
import store from './store';
class Counter extends Component {
  render() {
    return (
      <div>
        <p>{this.props.number}</p>
        <button onClick={this.props.add}>+</button>
        <button onClick={this.props.thunkAdd}>thunkAdd</button>
        <button onClick={this.props.promiseAdd}>promiseAdd</button>
        <button onClick={this.props.minus}>-</button>
      </div>
    );
  }
}

function Counter1(props) {
  const state = useSelector((state) => state.counter);
  const { add, minus } = useBoundDispatch(actionCreators);
  return (
    <div>
      <p>{state.number}</p>
      <button onClick={add}>+</button>
      <button onClick={minus}>-</button>
    </div>
  );
}

const mapStateToProps = (state) => state.counter;
const mapDispatchToProps = actionCreators;

/**
 * connect 连接仓库和组件
 * 输入 把仓库的状态输入到组件中
 * 输出 dispatch方法在组件里可以派发
 */

const FunctinalCounter = connect(mapStateToProps, mapDispatchToProps)(Counter);

ReactDOM.render(
  <Provider store={store}>
    <FunctinalCounter />
    <Counter1 />
  </Provider>,
  document.getElementById('root')
);
