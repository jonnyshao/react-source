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
  const navigationContext = React.useMemo(() => ({ navigator }), [navigator]);

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

/**
 *
 * @param {*} routes 路由配置数组
 */
export function useRoutes(routes) {
  // 当前路径对象
  let location = useLocation();
  // 当前的路径字符串
  const pathname = location.pathname || "/";

  // for (let i = 0; i < routes.length; i++) {
  //   const { path, element } = routes[i];
  //   let match = matchPath(path, pathname);
  //   if (match) {
  //     return React.cloneElement(element, { ...element.props, match });
  //   }
  // }

  // return null;
  // 当前的地址栏中的路径和路由进行匹配
  let matches = matchRoutes(routes, { pathname });
  // 渲染匹配结果
  return _renderMatches(matches);
}

function _renderMatches(matches, parentMatches = []) {
  if (!matches) return null;
  // 渲染结果 从右向左执行 matches = [{route:{element:User}},{route:{element:UserAdd}}...]
  return matches.reduceRight((outlet, match, index) => {
    return (
      <RouteContext.Provider
        value={{ outlet, matches: matches.slice(0, index + 1) }}
      >
        {match.route.element}
      </RouteContext.Provider>
    );
  }, null);
}

/**
 *
 * @param {*} routes 路由配置
 * @param {*} location 当前路径
 */
function matchRoutes(routes, location) {
  // 获取路径名
  let pathname = location.pathname;
  // 打平所有的分支路径
  let branches = flattenRoutes(routes);

  let matches = null;
  // 按分支顺序进行匹配，匹配成功退出返回
  for (let i = 0; matches == null && i < branches.length; i++) {
    matches = matchRouteBranch(branches[i], pathname);
  }
  return matches;
}
/**
 *
 * @param {*} path 路由路径
 * @param {*} pathname 当前地址栏中的路径
 */

export function matchPath({ path, end }, pathname) {
  //  路径编译成正则
  let [matcher, paramNames] = compilePath(path, end);

  // 匹配结果
  let match = pathname.match(matcher);
  if (!match) {
    return null;
  }
  // 获取匹配的路径
  let matchedPathname = match[0];
  // /user/ => /user 最后一个或多个'/' 去掉
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");

  // 拼出paramNames
  let values = match.slice(1);
  let captureGroups = match.slice(1);
  let params = paramNames.reduce((memo, paramName, index) => {
    // /user/*
    if (paramName === "*") {
      let splatValue = captureGroups[index] || ""; // /user/add
      // 重写pathnameBase = /user/add slice =/user/=>/user 截取*之前的字符串作为后续匹配的父串
      pathnameBase = matchedPathname
        .slice(0, matchedPathname.length - splatValue.length)
        .replace(/(.)\/+/, "$1");
    }
    memo[paramName] = values[index];
    return memo;
  }, {});

  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
  };

  // let match = pathname.match(matcher);
  // if (!match) return null;
  // // 匹配到的路径字符串 path=/user/:id pathname
  // const matchedPathname = match[0];
  // let values = match.slice(1);
  // let params = paramNames.reduce((memo, paramName, index) => {
  //   memo[paramName] = values[index];
  //   return memo;
  // }, {});
  // return { params, path, pathname, matchedPathname };
}

/**
 * 分支的路径匹配地址栏的路径名
 * @param {*} branch
 * @param {*} pathname 完整路径
 */
function matchRouteBranch(branch, pathname) {
  let { routesMeta } = branch;
  // path=/:a/:b/:c pathname = /va/vb/vc
  let matchesParams = {}; // a:va b:vb c:vc
  let matchedPathname = "/";
  let matches = [];
  for (let i = 0; i < routesMeta.length; i++) {
    // 获取当前meta
    let meta = routesMeta[i];
    // 判断当前是否是最的一个meta
    let end = i === routesMeta.length - 1;
    let remainingPathname =
      matchedPathname === "/"
        ? pathname
        : pathname.slice(matchedPathname.length);
    let match = matchPath({ path: meta.relativePath, end }, remainingPathname);
    // 如果匹配失败
    if (!match) return null;

    Object.assign(matchesParams, match.params);
    let route = meta.route;
    matches.push({
      params: matchesParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: joinPaths([matchedPathname, match.pathnameBase]),
      route,
    });
    if (match.pathname !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }

  console.log(matches);
  return matches;
}

/**
 * 拍平所有的分支
 * @param {*} routes 路由配置
 */
function flattenRoutes(
  routes,
  branches = [],
  parentMeta = [],
  parentPath = ""
) {
  routes.forEach((route) => {
    // 路由元数据
    let meta = {
      relativePath: route.path || "", // 相对父路径的路径
      route,
    };
    // 父 路径加上自己的相对路径构建完成路径
    let path = joinPaths([parentPath, meta.relativePath]);
    // 父meta数组中添加自己这个meta
    let routesMeta = parentMeta.concat(meta);
    // 如果有子路径的话 递归添加到branches分支数组中
    if (route.children && route.children.length > 0) {
      flattenRoutes(route.children, branches, routesMeta, path);
    }
    branches.push({
      path,
      routesMeta,
    });
  });
  return branches;
}

function joinPaths(paths) {
  return paths.join("/").replace(/\/\/+/g, "/");
}

export function createRoutesFromChildren(children) {
  let routes = [];
  React.Children.forEach(children, (element) => {
    let route = {
      path: element.props.path, // 路由对应的路径
      element: element.props.element, // 路由对应的元素 组件
    };
    // 嵌套路由处理
    if (element.props.children) {
      route.children = createRoutesFromChildren(element.props.children);
    }
    routes.push(route);
  });

  return routes;
}

export function Route() {}

function compilePath(path, end) {
  // 路径参数的参数名数组/post:/id
  let paramNames = [];
  let regexpSource = `^${path
    // 零个或多个 '/'
    .replace(/\/*\*?$/, "") // 把结尾 的 /*替换 为空   /user*  /user/* /user//* /user//**
    .replace(/^\/*/, "/") // 零个或多个'/'转成一个'/' user=> /user //user=> /user
    .replace(/:(\w+)/g, (_, key) => {
      paramNames.push(key);
      // 不能包含一个或多个 '/'
      return `([^\\/]+?)`;
    })}`;

  if (path.endsWith("*")) {
    paramNames.push("*");
    regexpSource += `(?:\\/(.+)|\\/*)$`;
  } else {
    regexpSource += end ? "\\/*$" : "(?:\\b|\\/|$)";
  }

  let matcher = new RegExp(regexpSource);
  return [matcher, paramNames];
}

export function useNavigate() {
  const { navigator } = React.useContext(NavigationContext);
  const navigate = React.useCallback((to) => navigator.push(to), [navigator]);
  return navigate;
}

export function useParams() {
  const { matches } = React.useContext(RouteContext);
  let routeMatch = matches[matches.length - 1];

  return routeMatch ? routeMatch.params : {};
}

export function Outlet() {
  return useOutlet();
}

function useOutlet() {
  let { outlet } = React.useContext(RouteContext);
  if (!outlet) return null;
  return outlet;
}
