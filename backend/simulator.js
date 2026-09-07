const buses = {
  1: [
    [13.0827, 80.2707],
    [13.0870, 80.2750],
    [13.0910, 80.2810],
    [13.0950, 80.2870],
    [13.1000, 80.2920],
  ],

  2: [
    [12.9249, 80.1000],
    [12.9300, 80.1100],
    [12.9380, 80.1180],
    [12.9450, 80.1260],
    [12.9520, 80.1320],
  ],

  3: [
    [12.9750, 80.2200],
    [12.9800, 80.2250],
    [12.9850, 80.2300],
    [12.9900, 80.2360],
    [12.9950, 80.2420],
  ],

  4: [
    [13.1143, 80.1098],
    [13.1180, 80.1140],
    [13.1220, 80.1190],
    [13.1260, 80.1240],
    [13.1300, 80.1290],
  ],
};

const indexes = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
};

async function updateBus(busId) {
  const route = buses[busId];
  const index = indexes[busId];

  const [latitude, longitude] = route[index];

  try {
    const response = await fetch(
      `http://localhost:5000/api/buses/${busId}/location`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude,
          longitude,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log(
        `🚌 Bus ${busId} → ${latitude}, ${longitude} ✅`
      );
    } else {
      console.log(
        `❌ Bus ${busId}:`,
        data.error
      );
    }

    indexes[busId] =
      (index + 1) % route.length;

  } catch (error) {
    console.error(
      `❌ Bus ${busId} connection error:`,
      error.message
    );
  }
}

async function updateAllBuses() {
  for (const busId of Object.keys(buses)) {
    await updateBus(busId);
  }
}

console.log("🚍 Multi-bus GPS simulator started");

updateAllBuses();

setInterval(updateAllBuses, 5000);