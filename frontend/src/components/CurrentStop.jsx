function CurrentStop({ stops, currentIndex }) {
  return (
    <div className="card shadow mt-4">
      <div className="card-body">
        <h4>🚏 Route Progress</h4>

        <ul className="list-group mt-3">
          {stops.map((stop, index) => (
            <li
              key={index}
              className={`list-group-item ${
                index === currentIndex
                  ? "list-group-item-success fw-bold"
                  : ""
              }`}
            >
              {index === currentIndex ? "🟢 " : "⚪ "}
              Stop {index + 1}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CurrentStop;