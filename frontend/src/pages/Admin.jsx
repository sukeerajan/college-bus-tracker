import { useEffect, useState } from "react";
import { supabase } from "../supabase";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const BUSES_API = `${API_URL}/api/buses`;

function Admin() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    driver: "",
    status: "Moving",
    route: "",
    latitude: "",
    longitude: "",
  });

  // ==========================================
  // CHECK AUTHENTICATION
  // ==========================================

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Session error:", error);
      }

      if (mounted) {
        setSession(data.session);
        setAuthLoading(false);
      }
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (mounted) {
          setSession(newSession);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ==========================================
  // LOAD BUSES
  // ==========================================

  useEffect(() => {
    if (!session) {
      return;
    }

    let cancelled = false;

    async function fetchBuses() {
      try {
        const response = await fetch(BUSES_API);

        const text = await response.text();

        let data;

        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            `Server returned invalid response (${response.status})`
          );
        }

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to fetch buses"
          );
        }

        if (!cancelled) {
          setBuses(data);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Load buses error:", error);
          alert(`❌ ${error.message}`);
        }
      }
    }

    fetchBuses();

    return () => {
      cancelled = true;
    };
  }, [session]);

  // ==========================================
  // LOGIN
  // ==========================================

  async function handleLogin(event) {
    event.preventDefault();

    setLoginError("");

    if (!email || !password) {
      setLoginError("Please enter email and password.");
      return;
    }

    setLoginLoading(true);

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        throw error;
      }

      setSession(data.session);

      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Login error:", error);

      setLoginError(
        error.message || "Invalid email or password."
      );
    } finally {
      setLoginLoading(false);
    }
  }

  // ==========================================
  // LOGOUT
  // ==========================================

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      alert(`❌ ${error.message}`);
      return;
    }

    setSession(null);
    setBuses([]);
  }

  // ==========================================
  // GET AUTH TOKEN
  // ==========================================

  async function getAccessToken() {
    const {
      data: { session: currentSession },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    if (!currentSession?.access_token) {
      throw new Error(
        "Admin session expired. Please login again."
      );
    }

    return currentSession.access_token;
  }

  // ==========================================
  // RELOAD BUSES
  // ==========================================

  async function reloadBuses() {
    try {
      const response = await fetch(BUSES_API);

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Server returned invalid response (${response.status})`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to fetch buses"
        );
      }

      setBuses(data);
    } catch (error) {
      console.error("Reload buses error:", error);
      alert(`❌ ${error.message}`);
    }
  }

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // ==========================================
  // ADD BUS
  // ADMIN ONLY
  // ==========================================

  async function handleAddBus(event) {
    event.preventDefault();

    if (
      !form.name ||
      !form.driver ||
      !form.route ||
      !form.latitude ||
      !form.longitude
    ) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      const token = await getAccessToken();

      const response = await fetch(BUSES_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          driver: form.driver,
          status: form.status,
          route: form.route,
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
        }),
      });

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Server returned invalid response (${response.status})`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to add bus"
        );
      }

      alert("✅ Bus added successfully!");

      setForm({
        name: "",
        driver: "",
        status: "Moving",
        route: "",
        latitude: "",
        longitude: "",
      });

      await reloadBuses();
    } catch (error) {
      console.error("Add bus error:", error);
      alert(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  // ==========================================
  // DELETE BUS
  // ADMIN ONLY
  // ==========================================

  async function handleDeleteBus(id, name) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = await getAccessToken();

      const response = await fetch(
        `${BUSES_API}/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Backend returned invalid response (${response.status})`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete bus"
        );
      }

      alert("🗑️ Bus deleted successfully!");

      await reloadBuses();
    } catch (error) {
      console.error("Delete bus error:", error);
      alert(`❌ ${error.message}`);
    }
  }

  // ==========================================
  // AUTH LOADING
  // ==========================================

  if (authLoading) {
    return (
      <div className="container mt-5">
        <div className="text-center py-5">
          <h4>🔐 Checking admin access...</h4>
        </div>
      </div>
    );
  }

  // ==========================================
  // LOGIN PAGE
  // ==========================================

  if (!session) {
    return (
      <div className="container mt-5 mb-5">
        <div
          className="card shadow mx-auto"
          style={{ maxWidth: "450px" }}
        >
          <div className="card-header bg-primary text-white text-center">
            <h3 className="mb-0">
              🔐 Admin Login
            </h3>
          </div>

          <div className="card-body p-4">
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">
                  Email
                </label>

                <input
                  type="email"
                  className="form-control"
                  placeholder="Admin email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  autoComplete="email"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Password
                </label>

                <input
                  type="password"
                  className="form-control"
                  placeholder="Admin password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="current-password"
                />
              </div>

              {loginError && (
                <div className="alert alert-danger">
                  ❌ {loginError}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loginLoading}
              >
                {loginLoading
                  ? "Signing in..."
                  : "🔐 Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ADMIN DASHBOARD
  // ==========================================

  return (
    <div className="container mt-4 mb-5">

      {/* HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">
          🚌 Bus Administration
        </h1>

        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      </div>

      {/* ADMIN EMAIL */}

      <div className="alert alert-success">
        🔐 Logged in as:{" "}
        <strong>
          {session.user.email}
        </strong>
      </div>

      {/* ADD BUS */}

      <div className="card shadow mb-5">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">
            ➕ Add New Bus
          </h4>
        </div>

        <div className="card-body">
          <form onSubmit={handleAddBus}>

            <div className="row">

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Bus Name
                </label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Bus 5"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Driver
                </label>

                <input
                  type="text"
                  name="driver"
                  className="form-control"
                  placeholder="Driver name"
                  value={form.driver}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Status
                </label>

                <select
                  name="status"
                  className="form-select"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Moving">
                    Moving
                  </option>

                  <option value="Stopped">
                    Stopped
                  </option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Route
                </label>

                <input
                  type="text"
                  name="route"
                  className="form-control"
                  placeholder="Route → College"
                  value={form.route}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Latitude
                </label>

                <input
                  type="number"
                  step="any"
                  name="latitude"
                  className="form-control"
                  placeholder="13.0827"
                  value={form.latitude}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Longitude
                </label>

                <input
                  type="number"
                  step="any"
                  name="longitude"
                  className="form-control"
                  placeholder="80.2707"
                  value={form.longitude}
                  onChange={handleChange}
                />
              </div>

            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading
                ? "Adding Bus..."
                : "➕ Add Bus"}
            </button>

          </form>
        </div>
      </div>

      {/* BUS LIST */}

      <div className="card shadow">

        <div className="card-header bg-dark text-white">
          <h4 className="mb-0">
            🚌 Registered Buses ({buses.length})
          </h4>
        </div>

        <div className="card-body">

          {buses.length === 0 ? (

            <div className="text-center py-4">
              <h5>No buses found</h5>
            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-bordered table-hover align-middle">

                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Bus</th>
                    <th>Driver</th>
                    <th>Status</th>
                    <th>Route</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {buses.map((bus) => (

                    <tr key={bus.id}>

                      <td>
                        {bus.id}
                      </td>

                      <td>
                        🚌 {bus.name}
                      </td>

                      <td>
                        {bus.driver}
                      </td>

                      <td>
                        <span
                          className={
                            bus.status === "Moving"
                              ? "badge bg-success"
                              : "badge bg-secondary"
                          }
                        >
                          {bus.status}
                        </span>
                      </td>

                      <td>
                        {bus.route}
                      </td>

                      <td>
                        {bus.position?.[0]}
                      </td>

                      <td>
                        {bus.position?.[1]}
                      </td>

                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            handleDeleteBus(
                              bus.id,
                              bus.name
                            )
                          }
                        >
                          🗑️ Delete
                        </button>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Admin;