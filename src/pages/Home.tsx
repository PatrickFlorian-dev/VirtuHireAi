import { useState } from "react";
import Login from "../pages/Login"; 
import Button from "../components/Button";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div>
      {user ? (
        <div>
          <h2>User has logged in, welcome!</h2>
          <Button text="Logout" onClick={logout} />
        </div>
      ) : (
        <div>
          {showLogin && <Login />} {/* ✅ Conditionally show login form */}
          <Button text="Register" onClick={() => setShowLogin(false)} />
          {!showLogin && (
            <div>
              <h3>Register Page Placeholder</h3>
              <Link to="/register">
                <Button text="Go to Register" onClick={() => {}} />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
