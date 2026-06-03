import { Navbar, Nav, Container } from "react-bootstrap";

function Navbar5() {
  return (
    <Navbar bg="dark" variant="dark">
      <Container className="justify-content-center">
        <Nav>
          <Nav.Link>Home</Nav.Link>
          <Nav.Link>Services</Nav.Link>
        </Nav>

        <Navbar.Brand className="mx-4">LOGO</Navbar.Brand>

        <Nav>
          <Nav.Link>Blog</Nav.Link>
          <Nav.Link>Contact</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Navbar5;
