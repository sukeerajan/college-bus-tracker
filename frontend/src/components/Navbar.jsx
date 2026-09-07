import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>🚌 College Bus Tracker</h2>

      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/track">Track Bus</Link></li>
        <li><Link to="/routes">Routes</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/admin">Admin</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;