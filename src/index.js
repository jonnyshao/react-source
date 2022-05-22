import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Routes } from "./react-router-dom";
import Home from "./components/Home";
import User from "./components/User";
import Profile from "./components/Profile";
ReactDOM.render(
  <HashRouter>
    <Routes>
      <Route path="/" index element={<Home />} exact />
      <Route path="/user" element={<User />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  </HashRouter>,
  document.getElementById("root")
);
