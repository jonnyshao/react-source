import React from "react";
import { Navigate } from "../react-router-dom";
function Protected(props) {
  let { component: RouteComponent } = props;

  return localStorage.getItem("login") ? (
    <RouteComponent />
  ) : (
    <Navigate to={{ pathname: "/login", state: { from: props.path } }} />
  );
}

export default Protected;
