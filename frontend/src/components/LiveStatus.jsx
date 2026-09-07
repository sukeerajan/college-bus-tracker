function LiveStatus({ bus, currentIndex }) {
  const speed = bus.status === "Moving" ? 35 : 0;
  const passengers = 28;

  return (
    <div className="card shadow mt-4">
      <div className="card-body">
        <h3>📊 Live Bus Status</h3>

        <div className="row mt-4">
          <div className="col-md-3">
            <h5>🚍 Bus</h5>
            <p>{bus.name}</p>
          </div>

          <div className="col-md-3">
            <h5>⚡ Speed</h5>
            <p>{speed} km/h</p>
          </div>

          <div className="col-md-3">
            <h5>👥 Passengers</h5>
            <p>{passengers} / 35</p>
          </div>

          <div className="col-md-3">
            <h5>📍 Current Stop</h5>
            <p>Stop {currentIndex + 1}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveStatus;