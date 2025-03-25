import { Container, Row, Col } from 'react-bootstrap';
import DynamicAgGridWithFetch from '../../components/grids/DynamicAgGrid';
import { useAuth } from "../../hooks/useAuth";

function CandidateManagement() {

  const { user } = useAuth();

  const tableName = 'Candidate';
  const username = user ? user.username : '';
  const query = { active: true, jobId: '1' };

  return (
    <Container>
      <Row>
        <Col md={12} className="bg-success text-white p-4">
          <DynamicAgGridWithFetch 
            tableName={tableName}
            username={username}
            query={query}
            title="Candidate Grid"
            enableExport={true}
            gridOptions={{ paginationPageSize: 50 }}
            hiddenColumns={["createdAt", "updatedAt", "password", "otherInfo"]}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default CandidateManagement;