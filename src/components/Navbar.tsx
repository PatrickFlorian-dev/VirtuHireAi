import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import Button from "./Button";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <nav>
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            <Button text="Logout" onClick={logout} />
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </>
  );
};

export default Navbar;
