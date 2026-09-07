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

  // CHECK AUTHENTICATION

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

  // LOAD BUSES

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

  // LOGIN

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

  // LOGOUT

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

  // GET AUTH TOKEN

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

  // RELOAD BUSES

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

  // HANDLE INPUT

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // ADD BUS

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

  // DELETE BUS

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

  // AUTH LOADING

  if (authLoading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">
          <div className="admin-loading-icon">🔐</div>
          <h2>Checking Admin Access</h2>
          <p>Please wait...</p>
        </div>
      </div>
    );
  }

  // LOGIN PAGE

  if (!session) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-card">

          <div className="admin-login-icon">
            🔐
          </div>

          <div className="admin-login-header">
            <div className="admin-login-badge">
              SECURE ACCESS
            </div>

            <h1>Admin Login</h1>

            <p>
              Sign in to manage college buses and
              transportation data.
            </p>
          </div>

          <form onSubmit={handleLogin}>

            <div className="admin-input-group">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Admin email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
              />
            </div>

            <div className="admin-input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Admin password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                autoComplete="current-password"
              />
            </div>

            {loginError && (
              <div className="admin-login-error">
                ❌ {loginError}
              </div>
            )}

            <button
              type="submit"
              className="admin-login-btn"
              disabled={loginLoading}
            >
              {loginLoading
                ? "Signing in..."
                : "🔐 Sign In"}
            </button>

          </form>

          <div className="admin-login-footer">
            🛡️ Authorized administrators only
          </div>

        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD

  return (
    <div className="admin-page">

      <section className="admin-header">

        <div>
          <div className="admin-header-badge">
            ⚙️ ADMINISTRATION PANEL
          </div>

          <h1>Bus Management</h1>

          <p>
            Manage registered buses and college
            transportation information.
          </p>
        </div>

        <div className="admin-header-right">

          <div className="admin-user">
            <span>LOGGED IN AS</span>
            <strong>{session.user.email}</strong>
          </div>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            🚪 Logout
          </button>

        </div>

      </section>

      <main className="admin-content">

        <section className="admin-summary">

          <div className="admin-summary-card">
            <div className="admin-summary-icon">
              🚌
            </div>

            <div>
              <span>Total Buses</span>
              <strong>{buses.length}</strong>
            </div>
          </div>

          <div className="admin-summary-card">
            <div className="admin-summary-icon">
              🟢
            </div>

            <div>
              <span>Moving Buses</span>

              <strong>
                {
                  buses.filter(
                    (bus) => bus.status === "Moving"
                  ).length
                }
              </strong>
            </div>
          </div>

          <div className="admin-summary-card">
            <div className="admin-summary-icon">
              ⏸️
            </div>

            <div>
              <span>Stopped Buses</span>

              <strong>
                {
                  buses.filter(
                    (bus) => bus.status !== "Moving"
                  ).length
                }
              </strong>
            </div>
          </div>

        </section>


        <section className="admin-add-card">

          <div className="admin-section-heading">

            <div className="admin-section-icon">
              ➕
            </div>

            <div>
              <h2>Add New Bus</h2>

              <p>
                Register a new college bus in the
                tracking system.
              </p>
            </div>

          </div>

          <form onSubmit={handleAddBus}>

            <div className="admin-form-grid">

              <div className="admin-input-group">
                <label>Bus Name</label>

                <input
                  type="text"
                  name="name"
                  placeholder="Bus 5"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-input-group">
                <label>Driver</label>

                <input
                  type="text"
                  name="driver"
                  placeholder="Driver name"
                  value={form.driver}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-input-group">
                <label>Status</label>

                <select
                  name="status"
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

              <div className="admin-input-group">
                <label>Route</label>

                <input
                  type="text"
                  name="route"
                  placeholder="Route → College"
                  value={form.route}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-input-group">
                <label>Latitude</label>

                <input
                  type="number"
                  step="any"
                  name="latitude"
                  placeholder="13.0827"
                  value={form.latitude}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-input-group">
                <label>Longitude</label>

                <input
                  type="number"
                  step="any"
                  name="longitude"
                  placeholder="80.2707"
                  value={form.longitude}
                  onChange={handleChange}
                />
              </div>

            </div>

            <button
              type="submit"
              className="admin-add-btn"
              disabled={loading}
            >
              {loading
                ? "Adding Bus..."
                : "➕ Add Bus"}
            </button>

          </form>

        </section>


        <section className="admin-buses-card">

          <div className="admin-section-heading">

            <div className="admin-section-icon">
              🚌
            </div>

            <div>
              <h2>
                Registered Buses
                <span className="bus-total">
                  {buses.length}
                </span>
              </h2>

              <p>
                Manage all buses currently registered
                in the system.
              </p>
            </div>

          </div>

          {buses.length === 0 ? (

            <div className="admin-empty">
              <div>🚌</div>

              <h3>No Buses Found</h3>

              <p>
                Add your first bus using the form above.
              </p>
            </div>

          ) : (

            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>BUS</th>
                    <th>DRIVER</th>
                    <th>STATUS</th>
                    <th>ROUTE</th>
                    <th>LOCATION</th>
                    <th>ACTION</th>
                  </tr>
                </thead>

                <tbody>

                  {buses.map((bus) => (

                    <tr key={bus.id}>

                      <td>
                        <span className="table-id">
                          {bus.id}
                        </span>
                      </td>

                      <td>
                        <strong className="table-bus-name">
                          🚌 {bus.name}
                        </strong>
                      </td>

                      <td>
                        {bus.driver || "Not assigned"}
                      </td>

                      <td>
                        <span
                          className={
                            bus.status === "Moving"
                              ? "admin-status moving"
                              : "admin-status stopped"
                          }
                        >
                          ● {bus.status}
                        </span>
                      </td>

                      <td>
                        {bus.route}
                      </td>

                      <td>
                        <span className="table-location">
                          {bus.position?.[0]?.toFixed(5)}
                          <br />
                          {bus.position?.[1]?.toFixed(5)}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="admin-delete-btn"
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

        </section>

      </main>

    </div>
  );
}

export default Admin;