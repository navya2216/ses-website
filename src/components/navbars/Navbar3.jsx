import { Navbar, Nav, Container } from "react-bootstrap";

function Navbar3() {
  return (
    <Navbar bg="primary" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand>Sticky Navbar</Navbar.Brand>

        <Nav className="ms-auto">
          <Nav.Link>Home</Nav.Link>
          <Nav.Link>Features</Nav.Link>
          <Nav.Link>Pricing</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Navbar3;
