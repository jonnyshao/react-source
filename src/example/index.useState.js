// import React from "react";
// import ReactDOM from "react-dom";
import React from "../reactt";
import ReactDOM from "../react/react-domm";
function App() {
  const [number, setNumber] = React.useState(0);
  console.log("number", number);
  let handleClick = () => setNumber(number + 1);
  return (
    <div>
      <p>{number}</p>
      <button onClick={handleClick}>+</button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
