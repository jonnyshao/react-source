import React from "react";
import ReactDOM from "react-dom";
import {
  HashRouter,
  BrowserRouter,
  Route,
  Routes,
  NavLink,
  Navigate,
  useRoutes,
} from "./react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Protected from "./components/Protected.js";
import User from "./components/User";
import UserAdd from "./components/UserAdd";
import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail";
import Profile from "./components/Profile";
import routesConfig from "./routesConfig";

const LazyComponent = React.lazy(() => import("./components/Lazy"));

const activeStyle = {
  // backgroundColor: "green",
};
const activeClassName = "active";
const activeProps = {
  style: ({ isActive }) => (isActive ? activeStyle : {}),
  classNameProp: ({ isActive }) => (isActive ? activeClassName : {}),
};

function App() {
  let [routes, setRoutes] = React.useState(routesConfig);
  const addRoute = () => {
    setRoutes([
      ...routes,
      {
        path: "/lazy",
        element: (
          <React.Suspense fallback={<div>loading</div>}>
            <LazyComponent />
          </React.Suspense>
        ),
      },
    ]);
  };
  return (
    <React.Fragment>
      {useRoutes(routes)}
      <button onClick={addRoute}>添加路由</button>
    </React.Fragment>
  );
}

ReactDOM.render(
  <BrowserRouter>
    <ul>
      <li>
        <NavLink to="/" {...activeProps}>
          首页
        </NavLink>
      </li>
      <li>
        <NavLink to="/user" {...activeProps}>
          用户
        </NavLink>
      </li>
      <li>
        <NavLink to="/profile" {...activeProps}>
          个人中心
        </NavLink>
      </li>
      <li>
        <NavLink to="/lazy" {...activeProps}>
          Lazy
        </NavLink>
      </li>
    </ul>
    <App />
    {/* <Routes>
      <Route path="/user/*" element={<User />}>
        <Route path="add" element={<UserAdd />} />
        <Route path="list" element={<UserList />} />
        <Route path="list/detail/:userId" element={<UserDetail />} />
      </Route>
      <Route
        path="/profile"
        element={<Protected component={Profile} path="/profile" />}
      />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes> */}
  </BrowserRouter>,
  document.getElementById("root")
);
