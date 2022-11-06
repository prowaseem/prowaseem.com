import { Row, Col, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import MyImage from "../../assets/m-waseem.jpg";
import "./index.scss";

function Header(): JSX.Element {
  return (
    <Row className="header justify-content-center">
      <Col md="6" className="mt-5">
        <Image src={MyImage} roundedCircle fluid title="My Profile Picture" />
        <h1>Muhammad Waseem Irshad</h1>
        <p>Lead Software Engineer</p>
      </Col>
      <hr />
      <Col md="6">
        <Row className="subheader justify-content-between">
          <p>
            <FontAwesomeIcon icon={faEnvelope} />
            <a href="mailto:theprowaseem@gmail.com">theprowaseem@gmail.com</a>
          </p>
          <p>
            <FontAwesomeIcon icon={faLocationDot} />
            <span>Karachi, Pakistan</span>
          </p>
          <p>
            <FontAwesomeIcon icon={faPhone} />
            <span>+923158305202</span>
          </p>
        </Row>
      </Col>
    </Row>
  );
}

export default Header;
