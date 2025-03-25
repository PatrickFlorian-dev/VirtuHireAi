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
            hiddenColumns={[
              "createdAt",
              "updatedAt",
              "password",
              "otherInfo",
              "jobId",
              "secretJobCode",
              "secretJobCodeExpiration",
              "id",
              "jobId",
              "notes"
            ]}
            searchableColumns={["firstName"]}
            customColumnWidths={{
              active: 40,
              firstName: 145,
              lastName: 145,
              phase: 145,
              needSponsorship: 160,
              gender: 100,
              veteranStatus: 145,
              disability: 145,
              potential: 120,
              yearsOfExperience: 120,
              remote: 80
            }}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default CandidateManagement;