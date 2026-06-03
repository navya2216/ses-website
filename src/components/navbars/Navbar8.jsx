import { Navbar, Nav, Container } from "react-bootstrap";
import "./Navbar8.css";

function Navbar8() {
  return (
    <Navbar className="glass-navbar">
      <Container>
        <Navbar.Brand>Glass UI</Navbar.Brand>

        <Nav className="ms-auto">
          <Nav.Link>Home</Nav.Link>
          <Nav.Link>About</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Navbar8;
