import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function CandidateManagement() {
  return (
    <Container>
      <Row>
        <Col md={12} className="bg-success text-white p-4">Candidate Management (Admin)</Col>
      </Row>
    </Container>
  );
}

export default CandidateManagement;
