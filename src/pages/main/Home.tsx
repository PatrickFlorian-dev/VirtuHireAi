import { useState } from "react";
import Login from "./Login"; 
import Button from "../../components/Button";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Container, Row, Col } from 'react-bootstrap';

const Home = () => {
  const { user } = useAuth();
  const [showLogin] = useState(true);

  return (
    <Container fluid>

      <Row>

        <Col md={12} className="p-4">
          {user ? (
            <div className="text-center">
              <h2>Welcome {user.username}!</h2>
            </div>
          ) : (
            <div className="text-center">
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
        </Col>
        
      </Row>

    </Container>
  );
};

export default Home;
