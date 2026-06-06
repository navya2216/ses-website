import { Link } from "react-router-dom";
import Sidebar1 from "../components/sidebars/Sidebar1";
import Sidebar10 from "../components/sidebars/Sidebar10";
import Sidebar2 from "../components/sidebars/Sidebar2";
import Sidebar3 from "../components/sidebars/Sidebar3";
import Sidebar4 from "../components/sidebars/Sidebar4";
import Sidebar5 from "../components/sidebars/Sidebar5";
import Sidebar6 from "../components/sidebars/Sidebar6";
import Sidebar7 from "../components/sidebars/Sidebar7";
import Sidebar8 from "../components/sidebars/Sidebar8";
import Sidebar9 from "../components/sidebars/Sidebar9";

function SidebarPage() {
  return (
    <div className="page-shell">
      <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
        <div>
          <h1 className="h3">Sidebar examples</h1>
          <p className="text-muted mb-0">
            Mobile-friendly sidebar samples with responsive layout and custom
            spacing.
          </p>
        </div>
        <Link to="/" className="btn btn-outline-primary">
          Back to Home
        </Link>
      </div>

      <div className="row gy-4">
        <div className="col-12">
          <div className="section-preview">
            <h2>Simple sidebar</h2>
            <Sidebar1 />
          </div>
        </div>

        <div className="col-12">
          <div className="section-preview">
            <h2>Dark sidebar</h2>
            <Sidebar2 />
          </div>
        </div>

        <div className="col-12">
          <div className="section-preview">
            <h2>Sidebar with content</h2>
            <Sidebar3 />
          </div>
        </div>

        <div className="col-12">
          <div className="section-preview">
            <h2>Responsive sidebar</h2>
            <Sidebar4 />
          </div>
        </div>

        <div className="col-12">
          <div className="section-preview">
            <h2>Compact sidebar</h2>
            <Sidebar5 />
          </div>
        </div>

        <div className="col-12">
          <div className="section-preview">
            <h2>Sidebar menu</h2>
            <Sidebar6 />
          </div>
        </div>

        <div className="col-12">
          <div className="section-preview">
            <h2>Sidebar with actions</h2>
            <Sidebar7 />
          </div>
        </div>

        <div className="col-12">
          <div className="section-preview">
            <h2>Mini sidebar</h2>
            <Sidebar8 />
          </div>
        </div>

        <div className="col-12">
          <div className="section-preview">
            <h2>Vertical sidebar</h2>
            <Sidebar9 />
          </div>
        </div>

        <div className="col-12">
          <div className="section-preview">
            <h2>Offcanvas sidebar</h2>
            <Sidebar10 />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidebarPage;
