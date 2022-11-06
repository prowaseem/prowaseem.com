import { Row, Col } from "react-bootstrap";
import "./index.scss";

function Profile(): JSX.Element {
  return (
    <Row className="profile justify-content-center">
      <Col md="7" className="mt-5">
        <h2>Profile</h2>
        <p>
          Diligent software engineer with 7+ years of experience in web
          application development and maintenance. Eager to build innovative and
          cutting-edge business solutions for impressive clients. Worked in
          various tech stacks. Now developing skills in DevOps.
        </p>
      </Col>
    </Row>
  );
}

export default Profile;
