import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import Button from "./Button";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          {/* Left Side - Home Link */}
          <Link className="navbar-brand" to="/">Home <FontAwesomeIcon icon={faHome} /></Link>

          {/* Navbar Toggle for Mobile View */}
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Right Side - Links */}
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav"> 
                <li className="nav-item">
                </li>
                {user ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/dashboard">Admin</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">Profile</Link>
                  </li>
                  <li className="nav-item">
                    <Button text="Logout" onClick={logout} className="btn btn-danger nav-link" />
                  </li>
                </>
                ) : (
                <>
                  <li>
                    <Link className="nav-link" to="/demo">Demo</Link>
                  </li>
                  <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                  </li>
                </>
                )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
