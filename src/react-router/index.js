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
    let match = path === pathname;
    if (match) return element;
  }
  return null;
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
