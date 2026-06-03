import { FaHome, FaUser, FaCog } from "react-icons/fa";

function Sidebar5() {
  return (
    <div
      style={{
        width: "5rem",
        minHeight: "100vh",
        background: "#0f172a",
        color: "#fff",
        padding: "1rem",
      }}
    >
      <div className="mb-4">
        <FaHome size={24} />
      </div>

      <div className="mb-4">
        <FaUser size={24} />
      </div>

      <div>
        <FaCog size={24} />
      </div>
    </div>
  );
}

export default Sidebar5;
