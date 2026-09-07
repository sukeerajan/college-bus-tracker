import buses from "../data/buses";

function Routes() {
  return (
    <div className="container">
      <h1>College Bus Routes</h1>

      {buses.map((bus) => (
        <div className="bus-card" key={bus.id}>
          <h2>{bus.name}</h2>

          <p>Driver : {bus.driver}</p>

          <p>Route : {bus.route}</p>

          <p>Status : {bus.status}</p>
        </div>
      ))}
    </div>
  );
}

export default Routes;