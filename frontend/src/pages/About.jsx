function About() {
  return (
    <div className="about-page">

      <section className="about-header">
        <div>
          <div className="about-badge">
            🚌 COLLEGE BUS TRACKER
          </div>

          <h1>About the Project</h1>

          <p>
            A smart and simple way to monitor college
            buses using GPS technology.
          </p>
        </div>

        <div className="about-icon">
          🛰️
        </div>
      </section>


      <main className="about-content">

        <section className="about-main-card">

          <div className="about-card-icon">
            🚌
          </div>

          <div>
            <h2>College Bus Tracking System</h2>

            <p>
              College Bus Tracker is a web-based system
              designed to help students monitor college
              buses and check their current locations.
            </p>

            <p>
              The system uses GPS technology to provide
              bus location information, making it easier
              for students to know where their bus is
              during their journey.
            </p>
          </div>

        </section>


        <section className="about-features">

          <div className="about-feature-card">
            <div>📍</div>
            <h3>GPS Based</h3>
            <p>
              Bus locations can be monitored using
              GPS technology.
            </p>
          </div>


          <div className="about-feature-card">
            <div>🔄</div>
            <h3>Live Updates</h3>
            <p>
              Bus location information is updated
              continuously.
            </p>
          </div>


          <div className="about-feature-card">
            <div>🎓</div>
            <h3>Student Friendly</h3>
            <p>
              Designed to make college transportation
              easier to monitor.
            </p>
          </div>

        </section>


        <section className="about-purpose">

          <span>OUR PURPOSE</span>

          <h2>Making College Transportation Smarter</h2>

          <p>
            Our goal is to provide students with a
            convenient way to track college buses,
            understand their routes, and stay informed
            about their transportation.
          </p>

        </section>

      </main>

    </div>
  );
}

export default About;