import React from "react";
import ReactDOM from "react-dom";
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY,
    });
  };

  render() {
    return (
      <div
        onMouseMove={this.handleMouseMove}
        style={{ boxSizing: "border-box", border: "1px solid red" }}
      >
        {this.props.render(this.state)}
      </div>
    );
  }
}
function Show(props) {
  return (
    <React.Fragment>
      <h1>移动鼠标!</h1>
      <p>
        当前的鼠标位置是 ({props.x}, {props.y})
      </p>
    </React.Fragment>
  );
}
function withMouseTracker(OldComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { x: 0, y: 0 };
    }

    handleMouseMove = (event) => {
      this.setState({
        x: event.clientX,
        y: event.clientY,
      });
    };

    render() {
      return (
        <div
          onMouseMove={this.handleMouseMove}
          style={{ boxSizing: "border-box", border: "1px solid red" }}
        >
          <OldComponent {...this.state} />
        </div>
      );
    }
  };
}
const MouserTrackerShow = withMouseTracker(Show);
ReactDOM.render(<MouserTrackerShow />, document.getElementById("root"));
