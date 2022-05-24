import { createBrowserHistory, createHashHistory } from "../history";
import React from "react";
import { Router, useLocation, useNavigate } from "../react-router";

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
  const { to, children, ...rest } = props;

  return (
    <a onClick={() => navigate(to)} {...rest}>
      {children}
    </a>
  );
}

export function NavLink(props) {
  const {
    to,
    children,
    end = false,
    classNameProp,
    style = {},
    ...rest
  } = props;

  let location = useLocation();
  let path = { pathname: to };
  let locationPathname = location.pathname; // 当前的路径
  let toPathname = path.pathname; // 当前导航想要跳转的路径

  // 路径一样或当前路径是to开头的 并且以'/' 分隔
  let isActive =
    locationPathname === toPathname ||
    (!end &&
      /* `locationPathname` is the current pathname of the location. */
      locationPathname.startsWith(toPathname) &&
      locationPathname.charAt(toPathname.length) === "/");
  let className;

  if (typeof classNameProp == "function") {
    className = classNameProp({ isActive });
  }
  let computedStyle;
  if (typeof style === "function") {
    computedStyle = style({ isActive });
  }
  return (
    <Link {...rest} className={className} style={computedStyle} to={to}>
      {children}
    </Link>
  );
}
