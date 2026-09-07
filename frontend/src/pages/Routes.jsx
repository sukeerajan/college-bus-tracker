import buses from "../data/buses";

function Routes() {
  return (
    <div className="routes-page">

      <section className="routes-header">
        <div>
          <div className="routes-badge">
            🛣️ COLLEGE TRANSPORTATION
          </div>

          <h1>Bus Routes</h1>

          <p>
            Explore the available college buses,
            drivers, routes, and current status.
          </p>
        </div>

        <div className="routes-icon">
          🚌
        </div>
      </section>


      <main className="routes-content">

        <div className="routes-summary">
          <div>
            <span className="summary-number">
              {buses.length}
            </span>

            <span className="summary-text">
              Buses Available
            </span>
          </div>

          <div className="summary-live">
            ● LIVE SYSTEM
          </div>
        </div>


        <div className="routes-grid">

          {buses.map((bus) => (
            <div className="route-card" key={bus.id}>

              <div className="route-card-top">

                <div className="bus-number">
                  {bus.id}
                </div>

                <span
                  className={
                    bus.status === "Moving"
                      ? "route-status moving"
                      : "route-status"
                  }
                >
                  ● {bus.status}
                </span>

              </div>


              <h2>{bus.name}</h2>


              <div className="route-detail">

                <span>DRIVER</span>

                <strong>
                  {bus.driver || "Not assigned"}
                </strong>

              </div>


              <div className="route-detail">

                <span>ROUTE</span>

                <strong>
                  {bus.route}
                </strong>

              </div>


              <div className="route-card-footer">
                <span>GPS TRACKING</span>
                <span>● ACTIVE</span>
              </div>

            </div>
          ))}

        </div>

      </main>

    </div>
  );
}

export default Routes;