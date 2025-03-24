import { useState } from 'react';
import { Nav, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  // 👇 Control the smoothness here (in milliseconds)
  const transitionSpeed = 300; // adjust this number to make it slower (e.g., 500ms) or faster (e.g., 150ms)

  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col
          md={collapsed ? 1 : 3}
          className="bg-dark text-white vh-100 p-3"
          style={{
            transition: `all ${transitionSpeed}ms ease-in-out`,
            overflow: 'hidden',
            width: collapsed ? '80px' : '250px', // fallback if md doesn't cover it
          }}
        >
          <Button
            variant="outline-light"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="mb-4"
          >
            {collapsed ? '☰' : '✕'}
          </Button>

          <div
            style={{
              opacity: collapsed ? 0 : 1,
              transition: `opacity ${transitionSpeed}ms ease-in-out`,
              pointerEvents: collapsed ? 'none' : 'auto',
            }}
          >
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/" className="text-white">Home</Nav.Link>
              <Nav.Link as={Link} to="/admin/dashboard" className="text-white">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/admin/company" className="text-white">Company Management</Nav.Link>
              <Nav.Link as={Link} to="/admin/employee" className="text-white">Employee Management</Nav.Link>
              <Nav.Link as={Link} to="/admin/job" className="text-white">Job Management</Nav.Link>
              <Nav.Link as={Link} to="/admin/interview" className="text-white">Interview Management</Nav.Link>
              <Nav.Link as={Link} to="/admin/candidate" className="text-white">Candidate Management</Nav.Link>
            </Nav>
          </div>
        </Col>

        {/* Main Content */}
        <Col
          md={collapsed ? 11 : 9}
          style={{
            transition: `all ${transitionSpeed}ms ease-in-out`,
          }}
          className="p-4"
        >
          {children}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLayout;
