// import React from "react";
// import ReactDOM from "react-dom";
import React from "../reactt";
import ReactDOM from "../react/react-domm";

const FunctinalComponent = (props) => (
  <h1 style={{ color: "red" }}>
    h1 hello <span>{props.name}</span>{" "}
  </h1>
);
const Func = (props, forwardRef) => <div ref={forwardRef}>forward</div>;
const ForwardFunc = React.forwardRef(Func);

class Counter extends React.Component {
  static defaultProps = {
    name: "Jonny",
  };
  constructor(props) {
    super(props);
    this.state = { number: 0 };
    console.log("Counter 1.constructor");
  }
  UNSAFE_componentWillMount() {
    console.log("Counter 2.componentWillMount");
  }
  componentDidMount() {
    console.log("Counter 4.componentDidMount");
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log("Counter 5.shouldComponentUpdate");
    return nextState.number % 2 == 0;
  }
  UNSAFE_componentWillUpdate() {
    console.log("Counter 6.componentWillUpdate");
  }
  componentDidUpdate() {
    console.log("Counter 7.componentDidUpdate");
  }

  handleClick = () => {
    this.setState({ number: this.state.number + 1 });
  };
  render() {
    console.log("Counter 3.render");
    return (
      <div>
        <h3>{this.state.number}</h3>
        {this.state.number === 4 ? null : (
          <ChildCounter count={this.state.number} />
        )}
        <button onClick={this.handleClick}>+</button>
      </div>
    );
  }
}

class ChildCounter extends React.Component {
  UNSAFE_componentWillMount() {
    console.log("ChildCounter 1.componentWillMount");
  }
  componentDidMount() {
    console.log("ChildCounter 3.componentDidMount");
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    console.log("ChildCounter 4.UNSAFE_componentWillReceiveProps");
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log("ChildCounter 5.shouldComponentUpdate");
    return nextProps.count % 3 == 0;
  }
  componentWillUnmount() {
    console.log("ChildCounter 6.componentWillUnmount");
  }
  render() {
    console.log("ChildCounter 2.render");
    return <p>{this.props.count}</p>;
  }
}

// class ClassComponent extends React.Component {
//   state = {
//     number: 0,
//     name: "Counter",
//   };
//   divRef = React.createRef();
//   func = React.createRef();
//   handleClick = (e) => {
//     /*  */

//     this.setState(
//       (state) => ({ number: state.number + 1 }),
//       function () {
//         this.forceUpdate();
//       }
//     );
//   };
//   handleDivClick = (e) => {
//     console.log(e);
//   };
//   render() {
//     return (
//       <div onClick={this.handleDivClick}>
//         <ForwardFunc ref={this.func} />
//         <h1 style={{ color: "red" }}>{this.state.name}</h1>
//         <p>{this.state.number}</p>
//         <button onClick={this.handleClick} ref={this.divRef}>
//           +
//         </button>
//       </div>
//     );
//   }
// }

ReactDOM.render(<Counter name="Ryan" />, document.getElementById("root"));
