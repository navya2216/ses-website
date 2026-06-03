import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";

function Navbar6() {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>Mega Menu</Navbar.Brand>

        <Nav>
          <NavDropdown title="Components">
            <NavDropdown.Item>Buttons</NavDropdown.Item>
            <NavDropdown.Item>Cards</NavDropdown.Item>
            <NavDropdown.Item>Forms</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Navbar6;
