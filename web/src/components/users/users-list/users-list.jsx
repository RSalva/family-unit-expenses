import { useEffect, useState } from "react";
import * as UsersApi from "../../../services/users-api";
import UserItem from "../user-item/user-item";

function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {

    async function fetchUsers() {
      const users = await UsersApi.listUsers();
      setUsers(users);
    }

    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    setUsers(users.filter((user) => user.id !== id));
    await UsersApi.deleteUser(id);
  }

  return (
    <ul className="list-group">
      {users?.map((user) => (
        <UserItem 
          key={user.id} 
          user={user}
          onDelete={() => handleDeleteUser(user.id)} />
      ))} 
    </ul>
  )
}

export default UsersList;