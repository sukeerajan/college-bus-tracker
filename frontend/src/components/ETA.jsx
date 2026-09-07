function ETA({ currentIndex, totalStops }) {
  const remainingStops = totalStops - currentIndex - 1;
  const eta = remainingStops * 3; // 3 minutes per stop

  return (
    <div className="card shadow mt-4">
      <div className="card-body">

        <h4>🕒 Live ETA</h4>

        <h5 className="mt-3">
          📍 Current Stop : Stop {currentIndex + 1}
        </h5>

        <h5>
          ➡️ Next Stop :
          {remainingStops > 0
            ? ` Stop ${currentIndex + 2}`
            : " Destination"}
        </h5>

        <h5>
          ⏱ ETA :
          {remainingStops > 0
            ? ` ${eta} min`
            : " Arrived"}
        </h5>

        <h5>
          📏 Remaining Stops : {remainingStops}
        </h5>

      </div>
    </div>
  );
}

export default ETA;