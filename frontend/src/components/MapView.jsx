import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


// Custom Bus Icon
const busIcon = new L.Icon({
  iconUrl: "/bus.png",
  iconSize: [45, 45],
  iconAnchor: [22, 42],
  popupAnchor: [0, -42],
});


// Move map when a bus is selected
function ChangeMapView({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 13, {
        animate: true,
      });
    }
  }, [position, map]);

  return null;
}


// Individual bus marker
function BusMarker({ bus, onSelect }) {
  if (!bus.position || bus.position.length < 2) {
    return null;
  }

  return (
    <Marker
      position={bus.position}
      icon={busIcon}
      eventHandlers={{
        click: () => onSelect(bus),
      }}
    >
      <Popup>
        <div style={{ minWidth: "220px" }}>

          <h5>🚌 {bus.name}</h5>

          <hr />

          <p className="mb-1">
            <strong>Driver:</strong>{" "}
            {bus.driver || "Not available"}
          </p>

          <p className="mb-1">
            <strong>Route:</strong>{" "}
            {bus.route || "Not available"}
          </p>

          <p className="mb-1">
            <strong>Status:</strong>{" "}
            <span
              style={{
                fontWeight: "bold",
                color:
                  bus.status === "Moving"
                    ? "green"
                    : "gray",
              }}
            >
              {bus.status || "Unknown"}
            </span>
          </p>

          <p className="mb-1">
            <strong>Latitude:</strong>{" "}
            {Number(bus.position[0]).toFixed(5)}
          </p>

          <p className="mb-2">
            <strong>Longitude:</strong>{" "}
            {Number(bus.position[1]).toFixed(5)}
          </p>

          <button
            type="button"
            className="btn btn-primary btn-sm w-100"
            onClick={() => onSelect(bus)}
          >
            📍 View Bus
          </button>

        </div>
      </Popup>
    </Marker>
  );
}


// Main map
function MapView({ buses, selectedBus, onBusSelect }) {

  if (!buses || buses.length === 0) {
    return (
      <div className="alert alert-warning text-center">
        No buses available.
      </div>
    );
  }


  // Find a bus with a valid GPS position
  const firstBus = buses.find(
    (bus) =>
      Array.isArray(bus.position) &&
      bus.position.length >= 2
  );


  if (!firstBus) {
    return (
      <div className="alert alert-warning text-center">
        No bus location available.
      </div>
    );
  }


  const mapCenter =
    selectedBus &&
    Array.isArray(selectedBus.position)
      ? selectedBus.position
      : firstBus.position;


  return (
    <MapContainer
      center={mapCenter}
      zoom={12}
      scrollWheelZoom={true}
      style={{
        height: "550px",
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >

      {/* Move map to selected bus */}
      {selectedBus &&
        Array.isArray(selectedBus.position) && (
          <ChangeMapView
            position={selectedBus.position}
          />
        )}


      {/* OpenStreetMap */}
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />


      {/* Show every bus */}
      {buses.map((bus) => (
        <BusMarker
          key={bus.id}
          bus={bus}
          onSelect={onBusSelect}
        />
      ))}


      {/* Show selected bus route */}
      {selectedBus &&
        Array.isArray(selectedBus.stops) &&
        selectedBus.stops.length > 1 && (
          <Polyline
            positions={selectedBus.stops}
          />
        )}

    </MapContainer>
  );
}


export default MapView;