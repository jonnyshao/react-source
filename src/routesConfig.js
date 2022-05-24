import React from "react";
import Login from "./components/Login";
import Protected from "./components/Protected.js";
import User from "./components/User";
import UserAdd from "./components/UserAdd";
import UserList from "./components/UserList";
import UserDetail from "./components/UserDetail";
import Profile from "./components/Profile";
import Home from "./components/Home";
import NotFound from "./components/NotFound";

const routes = [
  { path: "/", index: true, element: <Home /> },
  {
    path: "/profile",
    element: <Protected component={Profile} path="/profile" />,
  },
  {
    path: "/user",
    element: <User />,
    children: [
      { path: "/add", element: <UserAdd /> },
      { path: "/list", element: <UserList /> },
      { path: "/detail/:id", element: <UserDetail /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "*", element: <NotFound /> },
];

export default routes;
