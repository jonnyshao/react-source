import React from "react";
import ReactReduxContext from "./ReactReduxContext";
/**
 * 向下层组件传递store
 * @param {*} props
 * @returns
 */
function Provider(props) {
  return (
    <ReactReduxContext.Provider value={{ store: props.store }}>
      {props.children}
    </ReactReduxContext.Provider>
  );
}

export default Provider;
