import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>React UI Gallery</h1>

      <ul>
        <li>
          <Link to="/navbars">Navbars</Link>
        </li>

        <li>
          <Link to="/sidebars">Sidebars</Link>
        </li>
        <li>
          <Link to="/cards">Cards</Link>
        </li>
      </ul>
    </div>
  );
}

export default Home;
