import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function EmployeeManagement() {
  return (
    <Container>
      <Row>
        <Col md={12} className="bg-success text-white p-4">Employee Management (Admin)</Col>
      </Row>
    </Container>
  );
}

export default EmployeeManagement;
