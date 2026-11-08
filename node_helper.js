var NodeHelper = require("node_helper");
var https = require("https");

module.exports = NodeHelper.create({
  start: function () {
    this.stations = {};
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "FETCH_TIDES") {
      this.fetchTides(payload);
    }
  },

  fetchTides: function (payload) {
    var self = this;
    var stationId = payload.stationId;
    var days = payload.days || 2;

    var now = new Date();
    var beginDate = this.formatDateParam(now);
    var end = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    var endDate = this.formatDateParam(end);

    var tidesUrl =
      "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions" +
      "&application=MMM-Tides&begin_date=" +
      beginDate +
      "&end_date=" +
      endDate +
      "&station=" +
      stationId +
      "&datum=mllw&units=metric&time_zone=lst_ldt&format=json&interval=hilo";

    this.httpsGet(tidesUrl, function (tideData) {
      if (tideData.error) {
        self.sendSocketNotification("TIDES_RESULT", { error: tideData.error.message });
        return;
      }

      var events = (tideData.predictions || []).map(function (p) {
        return {
          t: p.t,
          v: parseFloat(p.v),
          type: p.type,
        };
      });

      var stationName = self.stations[stationId];

      if (stationName) {
        self.sendResult(stationId, events, stationName);
      } else {
        var metaUrl =
          "https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations/" +
          stationId +
          "?type=tidepredictions";

        self.httpsGet(metaUrl, function (metaData) {
          if (!metaData.error && metaData.stations && metaData.stations.length > 0) {
            stationName = metaData.stations[0].name;
            self.stations[stationId] = stationName;
          }
          self.sendResult(stationId, events, stationName);
        });
      }
    });
  },

  sendResult: function (stationId, events, stationName) {
    this.sendSocketNotification("TIDES_RESULT", {
      stationId: stationId,
      events: events,
      stationName: stationName,
    });
  },

  formatDateParam: function (date) {
    var yyyy = date.getFullYear();
    var mm = String(date.getMonth() + 1).padStart(2, "0");
    var dd = String(date.getDate()).padStart(2, "0");
    var hh = String(date.getHours()).padStart(2, "0");
    var mi = String(date.getMinutes()).padStart(2, "0");
    return yyyy + mm + dd + " " + hh + mi;
  },

  httpsGet: function (url, callback) {
    https
      .get(url, function (res) {
        var body = "";
        res.on("data", function (chunk) {
          body += chunk;
        });
        res.on("end", function () {
          try {
            var data = JSON.parse(body);
            if (data.error) {
              callback({ error: data.error });
            } else {
              callback(data);
            }
          } catch (e) {
            callback({ error: { message: "Failed to parse tide data" } });
          }
        });
      })
      .on("error", function () {
        callback({ error: { message: "Unable to reach NOAA tide service" } });
      });
  },
});
