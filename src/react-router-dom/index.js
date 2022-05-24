import { createBrowserHistory, createHashHistory } from "../history";
import React from "react";
import { Router, useNavigate } from "../react-router";

export * from "../react-router";

export function HashRouter({ children }) {
  let historyRef = React.useRef();
  if (!historyRef.current) {
    historyRef.current = createHashHistory();
  }
  let history = historyRef.current;
  let [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  //   监听history中的路径变化，当历史对象中的路径发生改变后执行setState
  React.useLayoutEffect(() => history.listen(setState), [history]);
  return (
    <Router
      children={children}
      location={state.location}
      navigator={history}
      navigationType={state.action}
    ></Router>
  );
}

export function BrowserRouter({ children }) {
  let historyRef = React.useRef();
  if (!historyRef.current) {
    historyRef.current = createBrowserHistory();
  }
  let history = historyRef.current;
  let [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });
  React.useLayoutEffect(() => history.listen(setState), [history]);
  return (
    <Router
      children={children}
      location={state.location}
      navigator={history}
      navigationType={state.action}
    ></Router>
  );
}

export function Link(props) {
  const navigate = useNavigate();
  const { to, children } = props;
  return <a onClick={() => navigate(to)}>{children}</a>;
}
