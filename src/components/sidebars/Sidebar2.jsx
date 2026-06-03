function Sidebar2() {
  return (
    <div
      style={{
        width: "16rem",
        minHeight: "100vh",
        background: "#111827",
        color: "#fff",
        padding: "1.5rem",
      }}
    >
      <h4>Dark Sidebar</h4>

      <div className="py-2">Dashboard</div>
      <div className="py-2">Analytics</div>
      <div className="py-2">Users</div>
      <div className="py-2">Settings</div>
    </div>
  );
}

export default Sidebar2;
