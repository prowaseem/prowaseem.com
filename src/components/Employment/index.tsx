import { Row, Col } from "react-bootstrap";
import "./index.scss";

function Employment(): JSX.Element {
  return (
    <Row className="employment justify-content-center">
      <Col md="7" className="mt-5">
        <h2>Employment History</h2>
        <section className="history">
          <h5>Lead Software Engineer, VentureDive, Karachi</h5>
          <p>June 2017 <span className="divider"></span> Present</p>
          <ul>
            <li>Developing and maintaining a web application for an AI-driven dental health startup</li>
            <ul>
              <li>Tech Stack: <strong>React, Node, MongoDB, Ant design</strong></li>
            </ul>
          </ul>
        </section>
      </Col>
    </Row>
  );
}

export default Employment;
