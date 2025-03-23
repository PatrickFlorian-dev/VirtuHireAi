import React from "react";
import { useAuth } from "../hooks/useAuth";

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Profile Page</h1>
      {user ? (
        <div>
          <p><strong>Name:</strong> {user.username}</p>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
};

export default Profile;
