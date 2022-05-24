import React from "react";
import ReactReduxContext from "../ReactReduxContext";

function useSelector(selector) {
  const { store } = React.useContext(ReactReduxContext);
  const { getState, subscribe } = store;
  const prevState = getState();
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  React.useLayoutEffect(() => {
    return subscribe(forceUpdate);
  }, []);
  const selectedState = selector(prevState);
  return selectedState;
}

export default useSelector;
