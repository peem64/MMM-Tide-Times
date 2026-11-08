# MMM-Tides

A MagicMirror² module that displays local tide times using free NOAA tide prediction data.

## Features

- Shows upcoming high and low tide predictions
- Fetches station name automatically from NOAA
- Supports metric (meters) and imperial (feet) height units
- Highlights the next upcoming tide event
- Displays "Today" / "Tomorrow" / weekday for each event
- No API key required — uses the free public NOAA Tides & Currents API

## Installation

1. Navigate to your MagicMirror `modules` directory:
   ```bash
   cd ~/MagicMirror/modules
   ```
2. Clone this module:
   ```bash
   git clone https://github.com/yourusername/MMM-Tides.git
   ```
3. Add the module to your `config/config.js`:

```javascript
{
  module: "MMM-Tides",
  position: "top_left",
  config: {
    stationId: "8443970",      // NOAA tide station ID
    stationName: null,         // Override the auto-fetched station name, or null to auto-fetch
    days: 2,                   // Number of days of predictions to fetch
    heightUnit: "metric",      // "metric" (meters) or "imperial" (feet)
    updateInterval: 3600000,   // Refresh every hour
    initialLoadDelay: 0,       // Delay before first fetch (ms)
    maxEvents: 7,              // Max number of upcoming events to display
  }
}
```

## Finding Your Station ID

Go to the [NOAA Tides & Currents station map](https://tidesandcurrents.noaa.gov/stations.html?type=Tide%20Predictions) and find the station nearest to you. The station ID is the numeric identifier shown on the station page (e.g., `8443970` for Boston, MA).

## Configuration Options

| Option            | Type    | Default     | Description                                      |
| ----------------- | ------- | ----------- | ------------------------------------------------ |
| `stationId`       | String  | `"8443970"` | NOAA tide prediction station ID                  |
| `stationName`     | String  | `null`      | Custom station name; auto-fetched when `null`     |
| `days`            | Number  | `2`         | Days of predictions to retrieve                   |
| `heightUnit`      | String  | `"metric"`  | `"metric"` for meters, `"imperial"` for feet      |
| `updateInterval`  | Number  | `3600000`   | Milliseconds between data refreshes               |
| `initialLoadDelay`| Number  | `0`         | Delay before first fetch (ms)                     |
| `maxEvents`       | Number  | `7`         | Maximum number of upcoming events to show          |

## Data Source

All tide data comes from the [NOAA Tides & Currents API](https://api.tidesandcurrents.noaa.gov/), which is free and requires no API key.
