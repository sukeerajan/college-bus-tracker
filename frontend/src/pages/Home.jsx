import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">

      <section className="home-hero">
        <div className="hero-content">

          <div className="hero-badge">
            🛰️ LIVE COLLEGE BUS TRACKING
          </div>

          <h1>
            College Bus
            <span>Tracker</span>
          </h1>

          <p>
            Track your college buses in real time,
            check their current location, and stay
            informed throughout your journey.
          </p>

          <div className="hero-buttons">

            {/* Track Bus */}
            <Link to="/track" className="primary-btn">
              🚌 Track a Bus
            </Link>

            {/* View Routes */}
            <Link to="/routes" className="secondary-btn">
              🗺️ View Routes
            </Link>

          </div>

        </div>

        <div className="hero-bus">
          🚌
        </div>
      </section>


      <section className="home-features">

        <div className="feature-card">
          <div className="feature-icon">📍</div>

          <h3>Live Location</h3>

          <p>
            View the current location of college
            buses on the map.
          </p>
        </div>


        <div className="feature-card">
          <div className="feature-icon">🔄</div>

          <h3>Real-Time Updates</h3>

          <p>
            Bus locations are continuously updated
            for accurate tracking.
          </p>
        </div>


        <div className="feature-card">
          <div className="feature-icon">🛣️</div>

          <h3>Bus Routes</h3>

          <p>
            Easily check available buses and
            their assigned routes.
          </p>
        </div>

      </section>


      <section className="home-info">

        <h2>Smart. Simple. Reliable.</h2>

        <p>
          College Bus Tracker provides a simple and
          convenient way for students to monitor
          college transportation from anywhere.
        </p>

        {/* Start Tracking */}
        <Link to="/track" className="info-btn">
          Start Tracking →
        </Link>

      </section>

    </div>
  );
}

export default Home;