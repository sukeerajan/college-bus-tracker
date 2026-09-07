function BusInfo({ bus, currentIndex }) {
  if (!bus) return null;

  const remainingStops = bus.stops.length - currentIndex - 1;
  const eta = remainingStops * 3; // 3 seconds per stop (simulation)

  return (
    <div className="card shadow-lg mt-4">
      <div className="card-body">
        <h3 className="mb-4">🚌 {bus.name}</h3>

        <div className="row">

          <div className="col-md-4 mb-3">
            <h5>👨 Driver</h5>
            <p>{bus.driver}</p>
          </div>

          <div className="col-md-4 mb-3">
            <h5>🛣 Route</h5>
            <p>{bus.route}</p>
          </div>

          <div className="col-md-4 mb-3">
            <h5>🟢 Status</h5>
            <span
              className={
                bus.status === "Moving"
                  ? "badge bg-success"
                  : "badge bg-danger"
              }
            >
              {bus.status}
            </span>
          </div>

          <div className="col-md-4 mb-3">
            <h5>📍 Current Stop</h5>
            <p>Stop {currentIndex + 1}</p>
          </div>

          <div className="col-md-4 mb-3">
            <h5>➡️ Next Stop</h5>
            <p>
              {currentIndex + 2 <= bus.stops.length
                ? `Stop ${currentIndex + 2}`
                : "Destination"}
            </p>
          </div>

          <div className="col-md-4 mb-3">
            <h5>⏱ ETA</h5>
            <p>{eta} sec</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default BusInfo;