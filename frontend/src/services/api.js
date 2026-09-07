export async function getBuses() {
  const response = await fetch("http://localhost:5000/api/buses");

  if (!response.ok) {
    throw new Error("Failed to fetch buses");
  }

  return await response.json();
}

export async function addBus(bus) {
  const response = await fetch("http://localhost:5000/api/buses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bus),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    throw new Error(
      errorData.error || "Failed to add bus"
    );
  }

  return await response.json();
}