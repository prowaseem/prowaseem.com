import { Row, Col, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import MyImage from "../../assets/m-waseem.jpg";
import profile from "../data/profile.json";
import "./index.scss";

function Header(): JSX.Element {
  return (
    <Row className="header justify-content-center">
      <Col md="6" className="mt-5">
        <Image src={MyImage} roundedCircle fluid title="My Profile Picture" />
        <h1>{profile.fullName}</h1>
        <p>{profile.location}</p>
      </Col>
      <hr />
      <Col md="7">
        <Row className="subheader justify-content-center">
          <p>
            <FontAwesomeIcon icon={faEnvelope} />
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </p>
          <p>
            <FontAwesomeIcon icon={faGithub} />
            <a href={profile.githubURL} target="_blank" rel="noreferrer">
              {profile.github}
            </a>
          </p>
          <p>
            <FontAwesomeIcon icon={faLocationDot} />
            <span>{profile.location}</span>
          </p>
          <p>
            <FontAwesomeIcon icon={faPhone} />
            <span>{profile.contact}</span>
          </p>
        </Row>
      </Col>
    </Row>
  );
}

export default Header;
