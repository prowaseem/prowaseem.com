import { Container } from "react-bootstrap";
import Header from "./Header";
import Profile from "./Profile";
import Employment from "./Employment";
import "./App.scss";

function App(): JSX.Element {
  return (
    <Container fluid>
      <Header />
      <Profile />
      <Employment />
    </Container>
  );
}

export default App;
