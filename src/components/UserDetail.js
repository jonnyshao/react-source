import React from "react";
import { useLocation, useParams } from "../react-router-dom";
import { UserAPI } from "../utils";
function UserDetail(props) {
  const [user, setUser] = React.useState({});
  const { userId } = useParams();
  const location = useLocation();
  React.useEffect(() => {
    let user = location.state;

    if (!user) {
      user = UserAPI.find(Number(userId));
    }
    user && setUser(user);
  }, [location, userId]);
  return (
    <div>
      <p>ID: {user.id}</p>
      <p>username: {user.username}</p>
    </div>
  );
}

export default UserDetail;
