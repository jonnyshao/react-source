import React from "react";
import { Link } from "../react-router-dom";
import { UserAPI } from "../utils";
function UserList(props) {
  const [users, setUsers] = React.useState([]);
  React.useEffect(() => {
    let users = UserAPI.getList();

    setUsers(users);
  }, []);
  return (
    <ul>
      {users.map((user, index) => (
        <li key={index}>
          <Link to={{ pathname: `/user/list/detail/${user.id}`, state: user }}>
            {user.username}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default UserList;
