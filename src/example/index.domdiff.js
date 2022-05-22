import React from "react";
import ReactDOM from "react-dom";
// import React from "./react";
// import ReactDOM from "./react/react-dom";

class Counter extends React.Component {
  shouldComponentUpdate() {
    console.log("shouldComponentUpdate");
    return false;
  }
  static getDerivedStateFromProps(props, state) {
    console.log(props);
    console.log(state);
  }
  constructor(props) {
    super(props);
    this.state = {
      list: ["A", "B", "C", "D", "E", "F"],
    };
  }
  handleClick = () => {
    this.setState({
      list: ["A", "C", "E", "B", "G"],
    });
    this.forceUpdate();
  };
  render() {
    return (
      <React.Fragment>
        <ul style={{ listStyle: "none" }}>
          {this.state.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <button onClick={this.handleClick}>Change</button>
      </React.Fragment>
    );
  }
}

ReactDOM.render(<Counter name="Ryan" />, document.getElementById("root"));
