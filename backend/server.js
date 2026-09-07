const express = require("express");
const cors = require("cors");
require("dotenv").config();

const supabase = require("./supabase");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================================================
   ADMIN AUTHENTICATION
   ========================================================= */

async function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Admin authentication required",
      });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
      return res.status(401).json({
        error: "Invalid authentication token",
      });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data || !data.user) {
      console.error("Authentication error:", error);

      return res.status(401).json({
        error: "Invalid or expired admin session",
      });
    }

    req.user = data.user;

    next();
  } catch (error) {
    console.error("Admin authentication error:", error);

    return res.status(401).json({
      error: "Authentication failed",
    });
  }
}

/* =========================================================
   GPS DEVICE AUTHENTICATION
   ========================================================= */

function requireGpsKey(req, res, next) {
  const gpsKey = req.headers["x-gps-key"];

  if (
    !process.env.GPS_DEVICE_KEY ||
    gpsKey !== process.env.GPS_DEVICE_KEY
  ) {
    return res.status(401).json({
      error: "Invalid GPS device key",
    });
  }

  next();
}

/* =========================================================
   HEALTH CHECK
   ========================================================= */

app.get("/", (req, res) => {
  res.json({
    message: "College Bus Tracker API is running",
    status: "online",
  });
});

/* =========================================================
   GET ALL BUSES
   PUBLIC
   ========================================================= */

app.get("/api/buses", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("buses")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);

      return res.status(500).json({
        error: "Failed to fetch buses",
      });
    }

    const buses = data.map((bus) => ({
      id: bus.id,
      name: bus.name,
      driver: bus.driver,
      status: bus.status,
      route: bus.route,

      position: [
        Number(bus.latitude),
        Number(bus.longitude),
      ],

      stops: [
        [
          Number(bus.latitude),
          Number(bus.longitude),
        ],

        [
          Number(bus.latitude) + 0.004,
          Number(bus.longitude) + 0.004,
        ],

        [
          Number(bus.latitude) + 0.008,
          Number(bus.longitude) + 0.010,
        ],

        [
          Number(bus.latitude) + 0.012,
          Number(bus.longitude) + 0.016,
        ],

        [
          Number(bus.latitude) + 0.018,
          Number(bus.longitude) + 0.022,
        ],
      ],

      last_updated: bus.last_updated,
    }));

    res.json(buses);
  } catch (error) {
    console.error("Server error:", error);

    res.status(500).json({
      error: "Server error",
    });
  }
});

/* =========================================================
   ADD NEW BUS
   ADMIN ONLY
   ========================================================= */

app.post("/api/buses", requireAdmin, async (req, res) => {
  try {
    const {
      name,
      driver,
      status,
      route,
      latitude,
      longitude,
    } = req.body;

    if (
      !name ||
      !driver ||
      !status ||
      !route ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        error: "All bus details are required",
      });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return res.status(400).json({
        error: "Latitude and longitude must be valid numbers",
      });
    }

    const { data, error } = await supabase
      .from("buses")
      .insert([
        {
          name,
          driver,
          status,
          route,
          latitude: lat,
          longitude: lng,
          last_updated: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);

      return res.status(500).json({
        error: "Failed to add bus",
      });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error("Server error:", error);

    res.status(500).json({
      error: "Server error",
    });
  }
});

/* =========================================================
   UPDATE BUS LOCATION
   GPS DEVICE ONLY
   ========================================================= */

app.put(
  "/api/buses/:id/location",
  requireGpsKey,
  async (req, res) => {
    try {
      const busId = Number(req.params.id);

      const {
        latitude,
        longitude,
      } = req.body;

      const lat = Number(latitude);
      const lng = Number(longitude);

      if (
        !Number.isFinite(busId) ||
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
      ) {
        return res.status(400).json({
          error:
            "Valid bus ID, latitude and longitude are required",
        });
      }

      const { data, error } = await supabase
        .from("buses")
        .update({
          latitude: lat,
          longitude: lng,
          last_updated: new Date().toISOString(),
        })
        .eq("id", busId)
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);

        return res.status(500).json({
          error: "Failed to update bus location",
        });
      }

      res.json(data);
    } catch (error) {
      console.error("Server error:", error);

      res.status(500).json({
        error: "Server error",
      });
    }
  }
);

/* =========================================================
   DELETE BUS
   ADMIN ONLY
   ========================================================= */

app.delete("/api/buses/:id", requireAdmin, async (req, res) => {
  try {
    const busId = Number(req.params.id);

    if (!Number.isFinite(busId)) {
      return res.status(400).json({
        error: "Invalid bus ID",
      });
    }

    const { data, error } = await supabase
      .from("buses")
      .delete()
      .eq("id", busId)
      .select();

    if (error) {
      console.error("Supabase error:", error);

      return res.status(500).json({
        error: "Failed to delete bus",
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        error: "Bus not found",
      });
    }

    res.json({
      message: "Bus deleted successfully",
      bus: data[0],
    });
  } catch (error) {
    console.error("Server error:", error);

    res.status(500).json({
      error: "Server error",
    });
  }
});

/* =========================================================
   GPS SIMULATOR
   ONLY FOR LOCAL DEVELOPMENT
   ========================================================= */

let simulatorRunning = false;

async function moveBuses() {
  try {
    const { data: buses, error } = await supabase
      .from("buses")
      .select("id, latitude, longitude, status");

    if (error) {
      console.error(
        "Simulator fetch error:",
        error
      );

      return;
    }

    if (!buses || buses.length === 0) {
      console.log(
        "🛰️ No buses available for simulation"
      );

      return;
    }

    for (const bus of buses) {
      if (bus.status !== "Moving") {
        continue;
      }

      const currentLat = Number(bus.latitude);
      const currentLng = Number(bus.longitude);

      if (
        !Number.isFinite(currentLat) ||
        !Number.isFinite(currentLng)
      ) {
        console.log(
          `⚠️ Invalid GPS position for Bus ${bus.id}`
        );

        continue;
      }

      const newLat = currentLat + 0.001;
      const newLng = currentLng + 0.001;

      const { error: updateError } =
        await supabase
          .from("buses")
          .update({
            latitude: newLat,
            longitude: newLng,
            last_updated:
              new Date().toISOString(),
          })
          .eq("id", bus.id);

      if (updateError) {
        console.error(
          `❌ Failed to move Bus ${bus.id}:`,
          updateError
        );
      } else {
        console.log(
          `🚌 Bus ${bus.id} moved → ` +
          `${newLat.toFixed(5)}, ` +
          `${newLng.toFixed(5)}`
        );
      }
    }
  } catch (error) {
    console.error(
      "❌ GPS simulator error:",
      error
    );
  }
}

/* =========================================================
   START GPS SIMULATOR
   ========================================================= */

function startSimulator() {
  if (process.env.ENABLE_SIMULATOR !== "true") {
    console.log("🛰️ GPS simulator disabled");
    return;
  }

  if (simulatorRunning) {
    return;
  }

  simulatorRunning = true;

  console.log(
    "🛰️ GPS movement simulator started"
  );

  setInterval(moveBuses, 5000);
}

/* =========================================================
   START SERVER
   ========================================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚍 Server running on http://localhost:${PORT}`
  );

  startSimulator();
});