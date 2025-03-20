import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar: React.FC = () => {
  const { user, login, logout } = useAuth();

  return (
    <nav className="navbar">
      <h1>VirtuHire AI</h1>
      <p>Simplifying and modernizing the hiring process</p>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/profile">Profile</Link></li>
      </ul>
      <div>
        {user ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <button onClick={() => login({ id: 1, name: "John Doe" })}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
