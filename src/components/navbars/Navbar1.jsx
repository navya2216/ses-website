import { Navbar, Nav, Container } from "react-bootstrap";

function Navbar1() {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>React UI Gallery</Navbar.Brand>

        <Nav className="ms-auto">
          <Nav.Link>Home</Nav.Link>
          <Nav.Link>About</Nav.Link>
          <Nav.Link>Contact</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Navbar1;
