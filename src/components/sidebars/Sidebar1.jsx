function Sidebar1() {
  return (
    <div
      className="bg-light p-3"
      style={{ width: "16rem", minHeight: "100vh" }}
    >
      <h4>Sidebar</h4>
      <ul className="list-unstyled">
        <li className="py-2">Dashboard</li>
        <li className="py-2">Users</li>
        <li className="py-2">Reports</li>
        <li className="py-2">Settings</li>
      </ul>
    </div>
  );
}

export default Sidebar1;
