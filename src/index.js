import React, { Component } from "react";
import ReactDOM from "react-dom";
import { bindActionCreators } from "./redux";
import actions from "./store/actions/counter";
import store from "./store";
const boundActions = bindActionCreators(actions, store.dispatch);
export default class Counter extends Component {
  unsubscribe;
  constructor(props) {
    super(props);
    this.state = { number: 0 };
  }
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.setState({ number: store.getState().counter.number });
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    return (
      <div>
        <p>{this.state.number}</p>
        <button onClick={boundActions.add}>+</button>
        <button onClick={boundActions.minus}>-</button>
      </div>
    );
  }
}

ReactDOM.render(
  <div>
    <Counter />
    <Counter />
  </div>,
  document.getElementById("root")
);
