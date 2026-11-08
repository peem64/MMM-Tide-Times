# MMM-Tides

A MagicMirror² module that displays UK tide times using the Admiralty (UKHO) Tidal API.

## Features

- Shows upcoming high and low tide predictions for 607 UK tidal stations
- Fetches station name automatically from the Admiralty API
- Supports metric (meters) and imperial (feet) height units
- Highlights the next upcoming tide event
- Displays "Today" / "Tomorrow" / weekday for each event
- Includes the required ADMIRALTY data attribution

## Requirements

You need a **free** Admiralty API key. The Discovery tier gives you a 1-year subscription to access current plus 6 days of tidal events for all 607 UK stations.

### Getting Your Free API Key

1. Go to the [Admiralty API Developer Portal](https://admiraltyapi.portal.azure-api.net/)
2. Sign up for an account
3. Navigate to **Products** and subscribe to the **UK Tidal API - Discovery** product (free)
4. Go to your profile page and copy your **Primary Key** from the subscriptions section

### Finding Your Station ID

Browse the station list via the Admiralty API or the [ADMIRALTY EasyTide](https://easytide.admiralty.co.uk/) tool to find the 4-digit station ID nearest to you. Some common examples:

| Station ID | Location          |
| ---------- | ----------------- |
| `0162`     | Dover             |
| `0231`     | Portsmouth        |
| `0131`     | London Bridge     |
| `0452`     | Liverpool (Gladstone Dock) |
| `0506`     | Belfast           |
| `0404`     | Holyhead          |
| `0322`     | Newlyn            |
| `0258`     | Weymouth          |

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
    stationId: "0162",          // Admiralty tide station ID (Dover by default)
    apiKey: "YOUR_API_KEY",     // Your free Admiralty API key
    stationName: null,          // Override the auto-fetched station name, or null to auto-fetch
    days: 2,                    // Days of predictions to fetch (max 7 on Discovery tier)
    heightUnit: "metric",       // "metric" (meters) or "imperial" (feet)
    updateInterval: 3600000,    // Refresh every hour (ms)
    initialLoadDelay: 0,        // Delay before first fetch (ms)
    maxEvents: 7,               // Max upcoming events to display
    showAttribution: true,      // Show "Contains ADMIRALTY tidal data" attribution
  }
}
```

## Configuration Options

| Option              | Type    | Default     | Description                                              |
| ------------------- | ------- | ----------- | -------------------------------------------------------- |
| `stationId`         | String  | `"0162"`    | Admiralty tide station ID                                |
| `apiKey`            | String  | `""`        | Your free Admiralty API key (required)                    |
| `stationName`       | String  | `null`      | Custom station name; auto-fetched when `null`             |
| `days`              | Number  | `2`         | Days of predictions (max 7 on free Discovery tier)        |
| `heightUnit`        | String  | `"metric"`  | `"metric"` for meters, `"imperial"` for feet              |
| `updateInterval`    | Number  | `3600000`   | Milliseconds between data refreshes                       |
| `initialLoadDelay`  | Number  | `0`         | Delay before first fetch (ms)                             |
| `maxEvents`         | Number  | `7`         | Maximum number of upcoming events to show                 |
| `showAttribution`   | Boolean | `true`      | Show required ADMIRALTY data attribution                  |

## Data Source

All tide data comes from the [Admiralty UK Tidal API](https://admiraltyapi.portal.azure-api.net/) (UK Hydrographic Office). The free Discovery tier provides current plus 6 days of predictions for 607 UK tidal stations.

Contains ADMIRALTY® Tidal Data: © Crown copyright and database right.
