import React from "react";

// 导航上下文
export const NavigationContext = React.createContext();
// 路径上下文
export const LocationContext = React.createContext();
// 路由上下文
export const RouteContext = React.createContext();

/**
 *
 * @param {*} children 子组件
 * @param {*} location 当前路径对象
 * @param {*} navigator history对象 go back forward push
 */
export function Router({ children, location, navigator }) {
  const navigationContext = React.useMemo(() => navigator, [navigator]);
  const locationContext = React.useMemo(() => ({ location }), [location]);

  return (
    <NavigationContext.Provider value={navigationContext}>
      <LocationContext.Provider value={locationContext} children={children} />
    </NavigationContext.Provider>
  );
}

export function Routes({ children }) {
  return useRoutes(createRoutesFromChildren(children));
}

export function useLocation() {
  return React.useContext(LocationContext).location;
}
export function useRoutes(routes) {
  let location = useLocation();
  const pathname = location.pathname || "/";

  for (let i = 0; i < routes.length; i++) {
    const { path, element } = routes[i];
    let match = matchPath(path, pathname);
    if (match) return element;
  }

  return null;
}

/**
 *
 * @param {*} path 路由路径
 * @param {*} pathname 当前地址栏中的路径
 */

export function matchPath(path, pathname) {
  let matcher = compilePath(path);
  let match = pathname.match(matcher);
  if (!match) return null;
  return match;
}

export function createRoutesFromChildren(children) {
  let routes = [];
  React.Children.forEach(children, (element) => {
    let route = {
      path: element.props.path,
      element: element.props.element,
    };
    routes.push(route);
  });
  return routes;
}

export function Route() {}

function compilePath(path) {
  let regexpSource = `^${path}$`;
  let matcher = new RegExp(regexpSource);
  return matcher;
}
