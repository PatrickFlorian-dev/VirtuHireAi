import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function AdminDashboard() {
  return (
    <Container>
      <Row>
        <Col md={12} className="bg-success text-white p-4">Admin Dashboard</Col>
      </Row>
    </Container>
  );
}

export default AdminDashboard;
