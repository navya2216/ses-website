import { Navbar, Nav, Container, Form, FormControl } from "react-bootstrap";

function Navbar4() {
  return (
    <Navbar bg="light">
      <Container>
        <Navbar.Brand>ShopNow</Navbar.Brand>

        <Form className="d-flex">
          <FormControl type="search" placeholder="Search Products" />
        </Form>

        <Nav>
          <Nav.Link>Cart</Nav.Link>
          <Nav.Link>Account</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Navbar4;
