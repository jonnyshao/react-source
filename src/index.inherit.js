// import React from "react";
// import ReactDOM from "react-dom";
import React from "./react";
import ReactDOM from "./react/react-dom";
// const loading = (message) => (OldComponent) => {
//   return class extends React.Component {
//     render() {
//       console.log(this);
//       const state = {
//         show: () => {
//           console.log("show", message);
//         },
//         hide: () => {
//           console.log("hide", message);
//         },
//       };
//       return (
//         <OldComponent
//           {...this.props}
//           {...state}
//           {...{ ...this.props, ...state }}
//         />
//       );
//     }
//   };
// };

// @loading("消息")
// class Hello extends React.Component {
//   render() {
//     console.log(this);
//     return (
//       <div>
//         hello<button onClick={this.props.show}>show</button>
//         <button onClick={this.props.hide}>hide</button>
//       </div>
//     );
//   }
// }
// let LoadingHello = loading("消息")(Hello);

class Button extends React.Component {
  state = { name: "张三" };
  componentWillMount() {
    console.log("Button componentWillMount");
  }
  componentDidMount() {
    console.log("Button componentDidMount");
  }
  render() {
    console.log("Button render");
    return <button name={this.state.name} title={this.props.title} />;
  }
}
const wrapper = (OldComponent) => {
  return class NewComponent extends OldComponent {
    state = { number: 0 };
    componentWillMount() {
      console.log("WrapperButton componentWillMount");
      super.componentWillMount();
    }
    componentDidMount() {
      console.log("WrapperButton componentDidMount");
      super.componentDidMount();
    }
    handleClick = () => {
      this.setState({ number: this.state.number + 1 });
    };
    render() {
      console.log("WrapperButton render");
      let renderElement = super.render();
      let newProps = {
        ...renderElement.props,
        ...this.state,
        onClick: this.handleClick,
      };
      return React.cloneElement(renderElement, newProps, this.state.number);
    }
  };
};
let WrappedButton = wrapper(Button);
ReactDOM.render(<WrappedButton />, document.getElementById("root"));
