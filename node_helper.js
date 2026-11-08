var NodeHelper = require("node_helper");
var https = require("https");

var ADMIRALTY_BASE = "https://admiraltyapi.portal.azure-api.net";

module.exports = NodeHelper.create({
  start: function () {
    this.stationCache = {};
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "FETCH_TIDES") {
      this.fetchTides(payload);
    }
  },

  fetchTides: function (payload) {
    var self = this;
    var stationId = payload.stationId;
    var apiKey = payload.apiKey;
    var days = payload.days || 2;

    if (!apiKey) {
      this.sendSocketNotification("TIDES_RESULT", {
        error: "No Admiralty API key configured. See README for setup instructions.",
      });
      return;
    }

    var eventsUrl =
      ADMIRALTY_BASE +
      "/api/V2/stations/" +
      encodeURIComponent(stationId) +
      "/TidalEvents?days=" +
      days;

    this.httpsGet(eventsUrl, apiKey, function (tideData) {
      if (tideData.error) {
        self.sendSocketNotification("TIDES_RESULT", { error: tideData.error.message });
        return;
      }

      var events = (tideData.events || []).map(function (e) {
        return {
          t: e.DateTime,
          v: e.Height,
          type: e.EventType === "HighWater" ? "H" : "L",
        };
      });

      var cached = self.stationCache[stationId];

      if (cached) {
        self.sendResult(events, cached);
      } else {
        var stationUrl = ADMIRALTY_BASE + "/api/V2/stations/" + encodeURIComponent(stationId);

        self.httpsGet(stationUrl, apiKey, function (stationData) {
          var stationName = null;

          if (!stationData.error && stationData.properties) {
            stationName = stationData.properties.Name;
            self.stationCache[stationId] = stationName;
          }

          self.sendResult(events, stationName);
        });
      }
    });
  },

  sendResult: function (events, stationName) {
    this.sendSocketNotification("TIDES_RESULT", {
      events: events,
      stationName: stationName,
    });
  },

  httpsGet: function (url, apiKey, callback) {
    var options = {
      url: url,
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
      },
    };

    https
      .get(url, options, function (res) {
        var body = "";
        res.on("data", function (chunk) {
          body += chunk;
        });
        res.on("end", function () {
          if (res.statusCode === 401 || res.statusCode === 403) {
            callback({ error: { message: "Invalid Admiralty API key" } });
            return;
          }
          if (res.statusCode === 429) {
            callback({ error: { message: "Admiralty API rate limit reached" } });
            return;
          }
          if (res.statusCode === 404) {
            callback({ error: { message: "Tide station not found" } });
            return;
          }
          try {
            var data = JSON.parse(body);
            callback(data);
          } catch (e) {
            callback({ error: { message: "Failed to parse tide data from Admiralty" } });
          }
        });
      })
      .on("error", function () {
        callback({ error: { message: "Unable to reach Admiralty tide service" } });
      });
  },
});
