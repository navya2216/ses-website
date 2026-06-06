import { Link } from "react-router-dom";
import Navbar1 from "../components/navbars/Navbar1";
import Navbar2 from "../components/navbars/Navbar2";
import Navbar3 from "../components/navbars/Navbar3";
import Navbar4 from "../components/navbars/Navbar4";
import Navbar5 from "../components/navbars/Navbar5";
import Navbar6 from "../components/navbars/Navbar6";
import Navbar7 from "../components/navbars/Navbar7";
import Navbar8 from "../components/navbars/Navbar8";
import Navbar9 from "../components/navbars/Navbar9";
import Navbar10 from "../components/navbars/Navbar10";

function NavbarPage() {
  return (
    <div className="page-shell">
      <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
        <div>
          <h1 className="h3">Navbar examples</h1>
          <p className="text-muted mb-0">
            Responsive Bootstrap navbars with clean spacing and custom page
            layout.
          </p>
        </div>
        <Link to="/" className="btn btn-outline-primary">
          Back to Home
        </Link>
      </div>

      <div className="row gy-4">
        <div className="col-12">
          <div className="section-preview">
            <h2>Dark top navbar</h2>
            <Navbar1 />
          </div>
        </div>

        <div className="col-12">
          <div className="section-preview">
            <h2>Portfolio navbar</h2>
            <Navbar2 />
          </div>
        </div>

        <div className="col-12">
          <div className="section-preview">
            <h2>Sticky navbar</h2>
            <Navbar3 />
          </div>
        </div>

        <div className="col-12">
          <div className="section-preview">
            <h2>Shop navbar</h2>
            <Navbar4 />
          </div>
        </div>

        <div className="col-12">
          <div className="section-preview">
            <h2>Centered brand navbar</h2>
            <Navbar5 />
          </div>
        </div>

        <div className="col-12">
          <div className="section-preview">
            <h2>Mega menu example</h2>
            <Navbar6 />
          </div>
        </div>

        <div className="col-12">
          <div className="section-preview">
            <h2>Dashboard navbar</h2>
            <Navbar7 />
          </div>
        </div>

        <div className="col-12">
          <div className="section-preview">
            <h2>Responsive header</h2>
            <Navbar8 />
          </div>
        </div>

        <div className="col-12">
          <div className="section-preview">
            <h2>Minimal navbar</h2>
            <Navbar9 />
          </div>
        </div>

        <div className="col-12">
          <div className="section-preview">
            <h2>Drawer menu navbar</h2>
            <Navbar10 />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavbarPage;
