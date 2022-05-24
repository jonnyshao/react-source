import React from "react";
import { useNavigate } from "../react-router-dom";
import { UserAPI } from "../utils";
function UserAdd(props) {
  const usernameRef = React.useRef();
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    let username = usernameRef.current.value;
    let user = { id: Date.now(), username };
    UserAPI.add(user);
    navigate("/user/list");
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" ref={usernameRef} />
      <button type="submit">添加</button>
    </form>
  );
}

export default UserAdd;
