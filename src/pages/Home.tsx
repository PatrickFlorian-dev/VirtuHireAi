import { useState } from "react";
import Login from "../pages/Login"; 
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const { user, logout } = useAuth();
  const [showLogin] = useState(true);

  return (
    <div>
      {user ? (
        <div>
            <h2>Welcome {user.username}!</h2>
          <Button text="Logout" onClick={logout} />
        </div>
      ) : (
        <div>
          {showLogin && <Login />} {/* ✅ Conditionally show login form */}
          {!showLogin && (
            <div>
              <h3>Register Page Placeholder</h3>
              <Link to="/register">
                <Button text="Register" onClick={() => {}} />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
