import React from "react";
import ReactDOM from "react-dom";
// import React from "./react";
// import ReactDOM from "./react/react-dom";

class ScrollList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: [1],
    };
  }
  static getDerivedStateFromProps(props, state) {
    console.log("getDerivedStateFromProps", props, state);
    return {
      message: [100, ...state.message],
    };
  }

  shouldComponentUpdate() {
    return false;
  }
  container = React.createRef();
  handleClick = () => {
    this.setState({
      message: [this.state.message.length + 1, ...this.state.message],
    });
    // this.forceUpdate();
  };
  addMessage = () => {
    this.setState({
      message: [`${this.state.message.length}`, ...this.state.message],
    });
  };
  componentDidMount() {
    // this.timerId = setInterval(() => {
    //   this.addMessage();
    // }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.timerId);
  }
  getSnapshotBeforeUpdate() {
    return {
      prevScrollTop: this.wrapper.scrollTop,
      prevScrollHeight: this.wrapper.scrollHeight,
    };
  }
  get wrapper() {
    return this.container.current;
  }
  componentDidUpdate(
    prevProps,
    prevState,
    { prevScrollTop, prevScrollHeight }
  ) {
    this.wrapper.scrollTop =
      prevScrollTop + (this.wrapper.scrollHeight - prevScrollHeight);
  }
  render() {
    console.log("render");
    const style = {
      height: "100px",
      width: "200px",
      border: "1px solid red",
      overflow: "auto",
    };
    return (
      <div>
        <button onClick={this.handleClick}>Change</button>
        <div style={style} ref={this.container}>
          {this.state.message.map((message, index) => (
            <div key={index}>{message}</div>
          ))}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<ScrollList name="Ryan" />, document.getElementById("root"));
