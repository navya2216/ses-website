import { useState } from "react";
import { Offcanvas, Button } from "react-bootstrap";

function Sidebar10() {
  const [show, setShow] = useState(false);

  return (
    <>
      <Button onClick={() => setShow(true)}>Open Sidebar</Button>

      <Offcanvas show={show} onHide={() => setShow(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Mobile Sidebar</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <div>Dashboard</div>
          <div>Users</div>
          <div>Reports</div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Sidebar10;
