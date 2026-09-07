function RouteProgress({ currentIndex, totalStops }) {
  const percentage =
    totalStops > 1
      ? (currentIndex / (totalStops - 1)) * 100
      : 0;

  return (
    <div className="card shadow mt-4">
      <div className="card-body">
        <h4>🛣 Route Progress</h4>

        <div className="progress mt-3" style={{ height: "25px" }}>
          <div
            className="progress-bar progress-bar-striped progress-bar-animated bg-success"
            role="progressbar"
            style={{ width: `${percentage}%` }}
          >
            {Math.round(percentage)}%
          </div>
        </div>

        <div className="mt-3">
          <strong>
            Stop {currentIndex + 1} of {totalStops}
          </strong>
        </div>
      </div>
    </div>
  );
}

export default RouteProgress;