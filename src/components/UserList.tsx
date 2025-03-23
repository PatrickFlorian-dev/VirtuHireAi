import { useEffect, useState } from "react";
import { fetchUsers } from "../api/userApi";
import { User } from "../interfaces/userTypes";

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers().then(setUsers).catch(console.error);
  }, []);

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
