import { Navbar, Nav, Container } from "react-bootstrap";

function Navbar2() {
  return (
    <Navbar expand="lg" className="bg-transparent">
      <Container>
        <Navbar.Brand>Portfolio</Navbar.Brand>

        <Nav className="ms-auto">
          <Nav.Link>Projects</Nav.Link>
          <Nav.Link>Services</Nav.Link>
          <Nav.Link>Contact</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Navbar2;
