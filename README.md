# MMM-Tide-Times

A MagicMirror² module that displays UK tide times using the WorldTides API. WorldTides provides global tide predictions, including comprehensive coverage of UK waters, using latitude and longitude to find the nearest prediction point.

## Features

- Shows upcoming high and low tide predictions for any UK (or worldwide) location
- Configured by latitude/longitude — no need to look up station IDs
- Supports metric (meters) and imperial (feet) height units
- Tide heights referenced to Chart Datum by default (configurable)
- Highlights the next upcoming tide event
- Displays "Today" / "Tomorrow" / weekday for each event
- Shows the required WorldTides copyright attribution

## Requirements

You need a **WorldTides API key**. WorldTides offers a free tier with a limited number of monthly credits — a single extremes request for a few days typically costs 1 credit.

### Getting Your API Key

1. Go to [worldtides.info/register](https://www.worldtides.info/register)
2. Create an account
3. Copy your API key from your account settings page

### Finding Your Latitude and Longitude

Use [Google Maps](https://www.google.com/maps) or any mapping tool — right-click your location to get the coordinates. Some common UK coastal locations are listed below for convenience:

| Location         | Latitude  | Longitude |
| ---------------- | --------- | --------- |
| Dover            | 51.1269   | 1.3136    |
| Portsmouth       | 50.8006   | -1.1066   |
| Southampton      | 50.8972   | -1.4067   |
| Liverpool        | 53.4459   | -3.0135   |
| Belfast          | 54.6072   | -5.9260   |
| Holyhead         | 53.3142   | -4.6325   |
| Newlyn           | 50.1028   | -5.5436   |
| Weymouth         | 50.6077   | -2.4545   |
| Edinburgh (Leith)| 55.9740   | -3.1667   |
| Cardiff          | 51.4678   | -3.1662   |
| Bristol (Avonmouth) | 51.4960 | -2.7180   |
| Hull             | 53.7453   | -0.3167   |

## Installation

1. Navigate to your MagicMirror `modules` directory:
   ```bash
   cd ~/MagicMirror/modules
   ```
2. Clone this module:
   ```bash
   git clone https://github.com/yourusername/MMM-Tide-Times.git
   ```
3. Add the module to your `config/config.js`:

```javascript
{
  module: "MMM-Tide-Times",
  position: "top_left",
  config: {
    lat: 51.1269,            // Latitude of your location
    lon: 1.3136,             // Longitude of your location
    locationName: "Dover",   // Display name shown in the header
    apiKey: "YOUR_API_KEY",  // Your WorldTides API key
    days: 3,                 // Days of predictions to fetch (1-7)
    heightUnit: "metric",    // "metric" (meters) or "imperial" (feet)
    datum: "CD",             // Vertical datum: "CD" (Chart Datum), "MSL", "LAT"
    updateInterval: 3600000, // Refresh every hour (ms)
    initialLoadDelay: 0,     // Delay before first fetch (ms)
    maxEvents: 7,            // Max upcoming events to display
    showAttribution: true,   // Show WorldTides copyright attribution
  }
}
```

## Configuration Options

| Option             | Type    | Default     | Description                                              |
| ------------------ | ------- | ----------- | -------------------------------------------------------- |
| `lat`              | Number  | `51.1269`   | Latitude of your tide location                           |
| `lon`              | Number  | `1.3136`    | Longitude of your tide location                          |
| `locationName`     | String  | `"Dover"`   | Display name shown in the module header                  |
| `apiKey`           | String  | `""`        | Your WorldTides API key (required)                       |
| `days`             | Number  | `3`         | Days of predictions to fetch (1-7)                        |
| `heightUnit`       | String  | `"metric"`  | `"metric"` for meters, `"imperial"` for feet             |
| `datum`            | String  | `"CD"`      | Vertical datum: `"CD"`, `"MSL"`, or `"LAT"`              |
| `updateInterval`   | Number  | `3600000`   | Milliseconds between data refreshes                      |
| `initialLoadDelay` | Number  | `0`         | Delay before first fetch (ms)                            |
| `maxEvents`        | Number  | `7`         | Maximum number of upcoming events to show                |
| `showAttribution`  | Boolean | `true`      | Show WorldTides copyright attribution                    |

## Data Source

All tide data comes from [WorldTides.info](https://www.worldtides.info/), which provides global tide predictions using satellite-derived bathymetry data and harmonic analysis.
