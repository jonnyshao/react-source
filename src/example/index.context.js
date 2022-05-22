// import React from "react";
// import ReactDOM from "react-dom";
import React from "../react";
import ReactDOM from "../react/react-dom";
const ColorContext = React.createContext();
console.log(ColorContext);
const style = { margin: "5px", padding: "5px" };

function Title() {
  return (
    <ColorContext.Consumer>
      {(contextValue) => (
        <div
          style={{
            ...style,
            border: `2px solid ${contextValue.color}`,
          }}
        >
          Title
        </div>
      )}
    </ColorContext.Consumer>
  );
}
function Content() {
  return (
    <ColorContext.Consumer>
      {(contextValue) => (
        <div
          style={{
            ...style,
            border: `2px solid ${contextValue.color}`,
          }}
        >
          Content
          <button onClick={() => contextValue.changeColor("pink")}>pink</button>
          <button onClick={() => contextValue.changeColor("yellowGreen")}>
            Green
          </button>
        </div>
      )}
    </ColorContext.Consumer>
  );
}

class Header extends React.Component {
  static contextType = ColorContext;
  render() {
    return (
      <div
        style={{
          ...style,
          border: `2px solid ${this.context.color}`,
        }}
      >
        Header
        <Title />
      </div>
    );
  }
}
class Main extends React.Component {
  static contextType = ColorContext;
  render() {
    return (
      <div
        style={{
          ...style,
          border: `2px solid ${this.context.color}`,
        }}
      >
        Main
        <Content />
      </div>
    );
  }
}
class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "black",
    };
  }
  changeColor = (color) => {
    this.setState({
      color,
    });
  };
  render() {
    const contextValue = {
      color: this.state.color,
      changeColor: this.changeColor,
    };
    return (
      <ColorContext.Provider value={contextValue}>
        <div
          style={{
            ...style,
            width: "250px",

            border: `2px solid ${this.state.color}`,
          }}
        >
          Panle
          <Header></Header>
          <Main></Main>
        </div>
      </ColorContext.Provider>
    );
  }
}

ReactDOM.render(<Panel name="Ryan" />, document.getElementById("root"));
