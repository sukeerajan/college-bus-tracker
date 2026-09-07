function NextStop({ currentIndex, totalStops }) {
  const isLast = currentIndex === totalStops - 1;

  return (
    <div className="card shadow mt-4">
      <div className="card-body">

        <h4>🚏 Live Stop Information</h4>

        <h5 className="mt-3">
          Current Stop : Stop {currentIndex + 1}
        </h5>

        <h5>
          Next Stop :
          {isLast
            ? " Destination"
            : ` Stop ${currentIndex + 2}`}
        </h5>

      </div>
    </div>
  );
}

export default NextStop;