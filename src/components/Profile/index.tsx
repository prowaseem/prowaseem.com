import { Row, Col } from "react-bootstrap";
import profile from "../data/profile.json";
import "./index.scss";

function Profile(): JSX.Element {
  return (
    <Row className="profile justify-content-center">
      <Col md="7" className="mt-5">
        <h2>Profile</h2>
        <p>{profile.bio}</p>
      </Col>
    </Row>
  );
}

export default Profile;
