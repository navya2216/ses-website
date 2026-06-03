import { Navbar, Nav, Container } from "react-bootstrap";

function Navbar9() {
  return (
    <Navbar
      style={{
        background: "linear-gradient(90deg,#6a11cb,#2575fc)",
      }}
    >
      <Container>
        <Navbar.Brand className="text-white">Gradient UI</Navbar.Brand>

        <Nav className="ms-auto">
          <Nav.Link className="text-white">Home</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Navbar9;
