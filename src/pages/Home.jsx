import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="page-shell">
      <div className="row justify-content-center mb-5">
        <div className="col-12 col-lg-8 text-center">
          <h1 className="display-5 fw-bold">React UI Gallery</h1>
          <p className="text-muted fs-5">
            Browse responsive Bootstrap page examples with clean custom styling
            for navbars and sidebars.
          </p>
        </div>
      </div>

      <div className="row gy-4">
        <div className="col-12 col-md-6">
          <div className="card home-card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h2>Responsive Navbars</h2>
              <p className="mb-4">
                Explore responsive Bootstrap navbar layouts that adapt to
                desktop and mobile.
              </p>
              <Link to="/navbars" className="btn btn-primary mt-auto">
                View Navbars
              </Link>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card home-card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <h2>Responsive Sidebars</h2>
              <p className="mb-4">
                See sidebar examples built for responsive layouts, with
                mobile-friendly toggles.
              </p>
              <Link to="/sidebars" className="btn btn-primary mt-auto">
                View Sidebars
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
