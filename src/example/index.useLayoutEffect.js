// import React from "react";
// import ReactDOM from "react-dom";
import React from "../reactt";
import ReactDOM from "../react/react-domm";
const Animate = () => {
  const ref = React.useRef();
  React.useLayoutEffect(() => {
    ref.current.style.transform = `translate(500px)`; //TODO
    ref.current.style.transition = `all 500ms`;
  });
  let style = {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    backgroundColor: "red",
  };
  return <div style={style} ref={ref}></div>;
};
ReactDOM.render(<Animate />, document.getElementById("root"));
