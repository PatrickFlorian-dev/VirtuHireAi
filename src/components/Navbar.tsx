import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Button from "./Button";

const Navbar: React.FC = () => {
  const { user, login, logout } = useAuth();

  return (
    <nav className="navbar">
      <h1>My App</h1>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
      <div>
        {user ? (
          <Button text="Logout" onClick={logout} className="logout-btn" />
        ) : (
          <Button
            text="Login"
            onClick={() => login({ id: 1, name: "John Doe" })}
            className="login-btn"
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
