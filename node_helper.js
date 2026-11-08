var NodeHelper = require("node_helper");
var https = require("https");

var WORLDTIDES_BASE = "https://www.worldtides.info/api/v3";

module.exports = NodeHelper.create({
  socketNotificationReceived: function (notification, payload) {
    if (notification === "FETCH_TIDES") {
      this.fetchTides(payload);
    }
  },

  fetchTides: function (payload) {
    var self = this;
    var apiKey = payload.apiKey;
    var lat = payload.lat;
    var lon = payload.lon;
    var days = payload.days || 2;
    var datum = payload.datum || "CD";

    if (!apiKey) {
      this.sendSocketNotification("TIDES_RESULT", {
        error: "No WorldTides API key configured. See README for setup instructions.",
      });
      return;
    }

    var today = new Date();
    var dateStr =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0");

    var url =
      WORLDTIDES_BASE +
      "?extremes&localtime&datum=" +
      encodeURIComponent(datum) +
      "&date=" +
      dateStr +
      "&days=" +
      days +
      "&lat=" +
      lat +
      "&lon=" +
      lon +
      "&key=" +
      encodeURIComponent(apiKey);

    this.httpsGet(url, function (data) {
      if (data.error) {
        self.sendSocketNotification("TIDES_RESULT", { error: data.error });
        return;
      }

      if (data.status && data.status !== 200) {
        self.sendSocketNotification("TIDES_RESULT", {
          error: data.error || "WorldTides API error (status " + data.status + ")",
        });
        return;
      }

      var extremes = data.extremes || [];

      var events = extremes.map(function (e) {
        var timestamp = e.date ? new Date(e.date).getTime() : e.dt * 1000;
        return {
          t: new Date(timestamp).toISOString(),
          v: e.height,
          type: e.type === "High" ? "H" : "L",
        };
      });

      var stationName = data.station || null;

      self.sendSocketNotification("TIDES_RESULT", {
        events: events,
        stationName: stationName,
        copyright: data.copyright || null,
      });
    });
  },

  httpsGet: function (url, callback) {
    https
      .get(url, function (res) {
        var body = "";
        res.on("data", function (chunk) {
          body += chunk;
        });
        res.on("end", function () {
          if (res.statusCode === 401 || res.statusCode === 403) {
            callback({ error: "Invalid WorldTides API key" });
            return;
          }
          if (res.statusCode === 429) {
            callback({ error: "WorldTides API rate limit reached" });
            return;
          }
          try {
            var data = JSON.parse(body);
            callback(data);
          } catch (e) {
            callback({ error: "Failed to parse tide data from WorldTides" });
          }
        });
      })
      .on("error", function () {
        callback({ error: "Unable to reach WorldTides service" });
      });
  },
});
