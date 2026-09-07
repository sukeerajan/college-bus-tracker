function BusCard({ bus }) {
  return (
    <div className="bus-card">
      <h2>{bus.number}</h2>

      <p>Status: {bus.status}</p>

      <p>Current Stop: {bus.stop}</p>

      <p>Destination: {bus.destination}</p>

      <button>View Live Tracking</button>
    </div>
  );
}

export default BusCard;