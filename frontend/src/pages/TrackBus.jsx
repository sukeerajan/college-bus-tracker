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
    <div className="track-page">

      <section className="track-header">
        <div>
          <div className="live-badge">
            ● LIVE TRACKING
          </div>

          <h1>Track Your Bus</h1>

          <p>
            Monitor college buses and view their
            current location in real time.
          </p>
        </div>

        <div className="track-header-icon">
          🚌
        </div>
      </section>

      <main className="track-content">

        {error && (
          <div className="track-error">
            ❌ {error}
          </div>
        )}

        <section className="tracker-control">

          <div>
            <h3>Choose a Bus</h3>

            <p>
              Select a bus to view its information
              and current location.
            </p>
          </div>

          <select
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

        </section>

        {buses.length > 0 && (
          <section className="map-section">

            <div className="map-title">

              <div>
                <h2>Live Bus Locations</h2>

                <p>
                  Bus positions update automatically.
                </p>
              </div>

              <span className="online-status">
                ● LIVE
              </span>

            </div>

            <MapView
              buses={buses}
              selectedBus={selectedBus}
              onBusSelect={handleBusSelect}
            />

          </section>
        )}

        <div className="bus-count-card">

          <div className="count-icon">
            🚌
          </div>

          <div>
            <strong>{buses.length}</strong>

            <span>
              Buses Currently Available
            </span>
          </div>

        </div>

        {selectedBus && (
          <section className="selected-bus-section">

            <div className="selected-bus-heading">

              <div>
                <span>SELECTED BUS</span>

                <h2>
                  🚌 {selectedBus.name}
                </h2>
              </div>

              <span
                className={
                  selectedBus.status === "Moving"
                    ? "status-moving"
                    : "status-stopped"
                }
              >
                ● {selectedBus.status}
              </span>

            </div>

            <div className="bus-details-grid">

              <div className="detail-box">
                <span>DRIVER</span>

                <strong>
                  {selectedBus.driver}
                </strong>
              </div>

              <div className="detail-box">
                <span>ROUTE</span>

                <strong>
                  {selectedBus.route}
                </strong>
              </div>

              <div className="detail-box">
                <span>STATUS</span>

                <strong>
                  {selectedBus.status}
                </strong>
              </div>

              <div className="detail-box">
                <span>CURRENT LOCATION</span>

                <strong>
                  {selectedBus.position?.[0]?.toFixed(5)}
                  {" , "}
                  {selectedBus.position?.[1]?.toFixed(5)}
                </strong>
              </div>

            </div>

          </section>
        )}

      </main>

    </div>
  );
}

export default TrackBus;