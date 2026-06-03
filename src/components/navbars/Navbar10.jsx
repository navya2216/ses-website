import { Navbar, Nav, Container, Offcanvas } from "react-bootstrap";
import { useState } from "react";

function Navbar10() {
  const [show, setShow] = useState(false);

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Drawer Menu</Navbar.Brand>

          <button className="btn btn-light" onClick={() => setShow(true)}>
            ☰
          </button>
        </Container>
      </Navbar>

      <Offcanvas show={show} onHide={() => setShow(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link>Home</Nav.Link>
            <Nav.Link>About</Nav.Link>
            <Nav.Link>Contact</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Navbar10;
