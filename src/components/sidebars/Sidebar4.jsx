import { useState } from "react";

function Sidebar4() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      style={{
        width: collapsed ? "5rem" : "16rem",
        minHeight: "100vh",
        background: "#1f2937",
        color: "#fff",
        transition: "0.3s",
        padding: "1rem",
      }}
    >
      <button
        className="btn btn-light mb-3"
        onClick={() => setCollapsed(!collapsed)}
      >
        ☰
      </button>

      {!collapsed && (
        <>
          <div className="py-2">Dashboard</div>
          <div className="py-2">Users</div>
          <div className="py-2">Reports</div>
        </>
      )}
    </div>
  );
}

export default Sidebar4;
