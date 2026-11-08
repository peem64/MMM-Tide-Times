function generateSampleTides() {
  const now = new Date();
  const events = [];

  const offsetsMinutes = [
    { min: -45, type: "H", height: 5.2 },
    { min: 90, type: "L", height: 1.1 },
    { min: 210, type: "H", height: 5.5 },
    { min: 330, type: "L", height: 0.8 },
    { min: 450, type: "H", height: 5.8 },
    { min: 570, type: "L", height: 1.3 },
    { min: 690, type: "H", height: 5.4 },
    { min: 810, type: "L", height: 1.5 },
    { min: 1800, type: "H", height: 5.3 },
    { min: 1920, type: "L", height: 1.2 },
    { min: 2040, type: "H", height: 5.6 },
    { min: 2160, type: "L", height: 1.0 },
    { min: 2280, type: "H", height: 5.7 },
    { min: 2400, type: "L", height: 1.4 },
  ];

  for (const e of offsetsMinutes) {
    const t = new Date(now.getTime() + e.min * 60 * 1000);
    events.push({
      t: t.toISOString(),
      v: e.height,
      type: e.type,
    });
  }

  return events;
}

function formatTime(date) {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDay = new Date(date);
  eventDay.setHours(0, 0, 0, 0);

  const diffDays = Math.round(
    (eventDay - today) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatHeight(meters) {
  return meters.toFixed(2) + " m";
}

export function renderTides() {
  const config = {
    locationName: "Dover",
    maxEvents: 7,
    heightUnit: "metric",
    showAttribution: true,
  };

  const events = generateSampleTides();
  const now = new Date();

  const wrapper = document.createElement("div");
  wrapper.className = "mirror-frame";

  const module = document.createElement("div");
  module.className = "tides-wrapper";

  const header = document.createElement("div");
  header.className = "tides-header";
  header.textContent = config.locationName;
  module.appendChild(header);

  const table = document.createElement("table");
  table.className = "tides-table";

  let shown = 0;

  for (const event of events) {
    if (shown >= config.maxEvents) break;

    const eventTime = new Date(event.t);
    if (eventTime < now) continue;

    const row = document.createElement("tr");
    row.className = "tides-row";
    if (shown === 0) row.classList.add("tides-next");

    const typeCell = document.createElement("td");
    typeCell.className = "tides-type tides-" + event.type;
    typeCell.innerHTML = event.type === "H" ? "&#9650;" : "&#9660;";
    row.appendChild(typeCell);

    const timeCell = document.createElement("td");
    timeCell.className = "tides-time";
    timeCell.textContent = formatTime(eventTime);
    row.appendChild(timeCell);

    const dateCell = document.createElement("td");
    dateCell.className = "tides-date";
    dateCell.textContent = formatDate(eventTime);
    row.appendChild(dateCell);

    const heightCell = document.createElement("td");
    heightCell.className = "tides-height";
    heightCell.textContent = formatHeight(event.v);
    row.appendChild(heightCell);

    table.appendChild(row);
    shown++;
  }

  module.appendChild(table);

  if (config.showAttribution) {
    const attr = document.createElement("div");
    attr.className = "tides-attribution";
    attr.textContent = "Tide data © WorldTides";
    module.appendChild(attr);
  }

  wrapper.appendChild(module);
  return wrapper;
}
