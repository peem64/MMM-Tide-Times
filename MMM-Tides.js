Module.register("MMM-Tides", {
  defaults: {
    lat: 51.1269,
    lon: 1.3136,
    locationName: "Dover",
    apiKey: "",
    days: 3,
    heightUnit: "metric",
    datum: "CD",
    updateInterval: 60 * 60 * 1000,
    initialLoadDelay: 0,
    maxEvents: 7,
    showAttribution: true,
  },

  getStyles: function () {
    return ["MMM-Tides.css"];
  },

  getTranslations: function () {
    return {
      en: "translations/en.json",
    };
  },

  start: function () {
    this.tideEvents = [];
    this.stationName = null;
    this.copyright = null;
    this.loaded = false;
    this.errorMessage = null;

    if (this.config.initialLoadDelay > 0) {
      var self = this;
      setTimeout(function () {
        self.scheduleUpdate(0);
      }, this.config.initialLoadDelay);
    } else {
      this.scheduleUpdate(0);
    }
  },

  getDom: function () {
    var wrapper = document.createElement("div");
    wrapper.className = "tides-wrapper";

    if (this.errorMessage) {
      wrapper.innerHTML = '<div class="tides-error">' + this.errorMessage + "</div>";
      return wrapper;
    }

    if (!this.loaded) {
      wrapper.innerHTML = '<div class="tides-loading">' + this.translate("LOADING") + "</div>";
      return wrapper;
    }

    var headerText = this.config.locationName || this.stationName;
    if (headerText) {
      var header = document.createElement("div");
      header.className = "tides-header";
      header.innerHTML = headerText;
      wrapper.appendChild(header);
    }

    var list = document.createElement("table");
    list.className = "tides-table";

    var now = new Date();
    var shown = 0;

    for (var i = 0; i < this.tideEvents.length && shown < this.config.maxEvents; i++) {
      var event = this.tideEvents[i];
      var eventTime = new Date(event.t);

      if (eventTime < now) {
        continue;
      }

      var row = document.createElement("tr");
      row.className = "tides-row";

      if (shown === 0) {
        row.classList.add("tides-next");
      }

      var typeCell = document.createElement("td");
      typeCell.className = "tides-type tides-" + event.type;
      typeCell.innerHTML = event.type === "H" ? "&#9650;" : "&#9660;";
      row.appendChild(typeCell);

      var timeCell = document.createElement("td");
      timeCell.className = "tides-time";
      timeCell.innerHTML = this.formatTime(eventTime);
      row.appendChild(timeCell);

      var dateCell = document.createElement("td");
      dateCell.className = "tides-date";
      dateCell.innerHTML = this.formatDate(eventTime, now);
      row.appendChild(dateCell);

      var heightCell = document.createElement("td");
      heightCell.className = "tides-height";
      heightCell.innerHTML = this.formatHeight(event.v);
      row.appendChild(heightCell);

      list.appendChild(row);
      shown++;
    }

    if (shown === 0) {
      var empty = document.createElement("div");
      empty.className = "tides-empty";
      empty.innerHTML = this.translate("NO_DATA");
      wrapper.appendChild(empty);
    } else {
      wrapper.appendChild(list);
    }

    if (this.config.showAttribution) {
      var attr = document.createElement("div");
      attr.className = "tides-attribution";
      attr.innerHTML = this.copyright || "Tide data &copy; WorldTides";
      wrapper.appendChild(attr);
    }

    return wrapper;
  },

  formatTime: function (date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  },

  formatDate: function (date, now) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var eventDay = new Date(date);
    eventDay.setHours(0, 0, 0, 0);

    var diffDays = Math.round((eventDay - today) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return this.translate("TODAY");
    } else if (diffDays === 1) {
      return this.translate("TOMORROW");
    } else if (diffDays === -1) {
      return this.translate("YESTERDAY");
    } else {
      return date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
    }
  },

  formatHeight: function (valueMeters) {
    if (this.config.heightUnit === "imperial") {
      var feet = valueMeters * 3.28084;
      return feet.toFixed(1) + " ft";
    }
    return valueMeters.toFixed(2) + " m";
  },

  scheduleUpdate: function (delay) {
    if (typeof delay === "undefined") {
      delay = this.config.updateInterval;
    }

    var self = this;
    clearTimeout(this.updateTimer);

    this.updateTimer = setTimeout(function () {
      self.updateTides();
    }, delay);
  },

  updateTides: function () {
    this.sendSocketNotification("FETCH_TIDES", {
      lat: this.config.lat,
      lon: this.config.lon,
      apiKey: this.config.apiKey,
      days: this.config.days,
      datum: this.config.datum,
    });
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "TIDES_RESULT") {
      if (payload.error) {
        this.errorMessage = payload.error;
        this.loaded = true;
        this.updateDom();
      } else {
        this.tideEvents = payload.events || [];
        this.stationName = payload.stationName || null;
        this.copyright = payload.copyright || null;
        this.errorMessage = null;
        this.loaded = true;
        this.updateDom();
      }
      this.scheduleUpdate();
    }
  },
});
