import React from "react";
import { useLocation, useNavigate } from "../react-router-dom";
function Login(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const login = () => {
    localStorage.setItem("login", true);
    let to = "/";
    if (location?.state?.from) {
      to = location.state.from;
    }
    navigate(to);
  };
  return <button onClick={login}>登录</button>;
}

export default Login;
