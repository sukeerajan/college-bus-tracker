import { useEffect, useState } from "react";
import { getBuses } from "../services/api";
import MapView from "../components/MapView";

function TrackBus() {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadBuses() {
      try {
        const data = await getBuses();

        if (active) {
          setBuses(data);
          setError("");
        }
      } catch (err) {
        console.error("Bus loading error:", err);

        if (active) {
          setError("Failed to load buses");
        }
      }
    }

    loadBuses();

    const interval = setInterval(loadBuses, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  function handleBusSelect(bus) {
    setSelectedBus(bus);
  }

  return (
    <div className="container mt-4 mb-5">

      <h1 className="text-center mb-4">
        🚌 College Bus Tracker
      </h1>

      {error && (
        <div className="alert alert-danger">
          ❌ {error}
        </div>
      )}

      {/* BUS SELECTOR */}

      <div className="card shadow mb-4">
        <div className="card-body">

          <label className="form-label fw-bold">
            Select Bus
          </label>

          <select
            className="form-select"
            value={selectedBus?.id || ""}
            onChange={(event) => {
              const id = Number(event.target.value);

              const bus = buses.find(
                (item) => item.id === id
              );

              setSelectedBus(bus || null);
            }}
          >
            <option value="">
              All Buses
            </option>

            {buses.map((bus) => (
              <option
                key={bus.id}
                value={bus.id}
              >
                {bus.name}
              </option>
            ))}
          </select>

        </div>
      </div>

      {/* MAP */}

      {buses.length > 0 && (
        <MapView
          buses={buses}
          selectedBus={selectedBus}
          onBusSelect={handleBusSelect}
        />
      )}

      {/* BUS COUNT */}

      <div className="alert alert-info mt-4 text-center">
        🚌 <strong>{buses.length}</strong> buses currently available
      </div>

      {/* SELECTED BUS */}

      {selectedBus && (
        <div className="card shadow mt-4">

          <div className="card-header bg-primary text-white">
            <h4 className="mb-0">
              🚌 {selectedBus.name}
            </h4>
          </div>

          <div className="card-body">

            <div className="row">

              <div className="col-md-3">
                <strong>Driver</strong>
                <p>{selectedBus.driver}</p>
              </div>

              <div className="col-md-3">
                <strong>Route</strong>
                <p>{selectedBus.route}</p>
              </div>

              <div className="col-md-3">
                <strong>Status</strong>
                <p>
                  <span
                    className={
                      selectedBus.status === "Moving"
                        ? "badge bg-success"
                        : "badge bg-secondary"
                    }
                  >
                    {selectedBus.status}
                  </span>
                </p>
              </div>

              <div className="col-md-3">
                <strong>Location</strong>

                <p>
                  {selectedBus.position?.[0]?.toFixed(5)}
                  {" , "}
                  {selectedBus.position?.[1]?.toFixed(5)}
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default TrackBus;