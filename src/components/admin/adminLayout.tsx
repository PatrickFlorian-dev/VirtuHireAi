import { useState } from 'react';
import { Nav, Button, Container, Row, Col } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faTachometerAlt,
  faBuilding,
  faUsers,
  faBriefcase,
  faCalendarCheck,
  faUserTie,
  faBars,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

const navItems = [
  { to: '/', label: 'Home', icon: faHome },
  { to: '/admin/dashboard', label: 'Dashboard', icon: faTachometerAlt },
  { to: '/admin/company', label: 'Company', icon: faBuilding },
  { to: '/admin/employee', label: 'Employee', icon: faUsers },
  { to: '/admin/job', label: 'Job', icon: faBriefcase },
  { to: '/admin/interview', label: 'Interview', icon: faCalendarCheck },
  { to: '/admin/candidate', label: 'Candidate', icon: faUserTie },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const transitionSpeed = 300;

  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col
          md="auto"
          className="bg-dark text-white vh-100 p-3"
          style={{
            transition: `width ${transitionSpeed}ms ease-in-out`,
            overflow: 'hidden',
            width: collapsed ? '80px' : '250px',
            position: 'relative',
          }}
        >
          <Button
            variant="outline-light"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="mb-4"
          >
            <FontAwesomeIcon icon={collapsed ? faBars : faTimes} />
          </Button>

          <Nav className="flex-column gap-3">
            {navItems.map((item) => (
              <Nav.Link
                as={Link}
                key={item.to}
                to={item.to}
                className={`d-flex align-items-center text-white gap-2 ${
                  location.pathname === item.to ? 'fw-bold' : 'fw-normal'
                }`}
                style={{
                  transition: `padding ${transitionSpeed}ms ease-in-out`,
                  paddingLeft: collapsed ? '0.5rem' : '1rem',
                  overflow: 'hidden',
                }}
              >
                <FontAwesomeIcon icon={item.icon} size="lg" />
                <span
                  style={{
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    transition: `transform ${transitionSpeed}ms ease, opacity ${transitionSpeed}ms ease`,
                    transform: collapsed ? 'translateX(-20px)' : 'translateX(0)',
                    opacity: collapsed ? 0 : 1,
                  }}
                >
                  {item.label}
                </span>
              </Nav.Link>
            ))}
          </Nav>
        </Col>

        {/* Main Content */}
        <Col
          style={{
            //transition: `margin-left ${transitionSpeed}ms ease-in-out`,
            //marginLeft: collapsed ? '80px' : '250px',
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
