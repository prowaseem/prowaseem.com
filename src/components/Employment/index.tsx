import { Row, Col } from "react-bootstrap";
import employment from "../data/employment.json";
import "./index.scss";

function Employment(): JSX.Element {
  return (
    <Row className="employment justify-content-center">
      <Col md="7" className="mt-5">
        <h2>Employment History</h2>
        {employment.map((company, i) => (
          <section className="history" key={i.toString()}>
            <h5>{company.title}</h5>
            <p>
              {company.startDate} <span className="divider"></span>{" "}
              {company.endDate}
            </p>
            <ul>
              {company.details.map((detail, j) => (
                <li key={j.toString()}>
                  <p>{detail.description}</p>
                  <ul className="history-sublisting">
                    <li>
                      <span>Tech Stack:</span> <strong>{detail.skills}</strong>
                    </li>
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </Col>
    </Row>
  );
}

export default Employment;
