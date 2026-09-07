import { FaBus, FaUserTie, FaRoad, FaClock } from "react-icons/fa";

function DashboardCards({ bus }) {
  if (!bus) return null;

  return (
    <div className="row mt-4 mb-4">

      <div className="col-md-3 mb-3">
        <div className="card shadow text-center">
          <div className="card-body">
            <FaBus size={35} className="text-primary mb-2" />
            <h5>Bus</h5>
            <h6>{bus.name}</h6>
          </div>
        </div>
      </div>

      <div className="col-md-3 mb-3">
        <div className="card shadow text-center">
          <div className="card-body">
            <FaUserTie size={35} className="text-success mb-2" />
            <h5>Driver</h5>
            <h6>{bus.driver}</h6>
          </div>
        </div>
      </div>

      <div className="col-md-3 mb-3">
        <div className="card shadow text-center">
          <div className="card-body">
            <FaRoad size={35} className="text-warning mb-2" />
            <h5>Route</h5>
            <h6>{bus.route}</h6>
          </div>
        </div>
      </div>

      <div className="col-md-3 mb-3">
        <div className="card shadow text-center">
          <div className="card-body">
            <FaClock size={35} className="text-danger mb-2" />
            <h5>Status</h5>
            <h6>{bus.status}</h6>
          </div>
        </div>
      </div>

    </div>
  );
}

export default DashboardCards;