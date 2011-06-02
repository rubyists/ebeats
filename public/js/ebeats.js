(function() {
  var beatsPerHour, beatsPerMinute, beatsPerSecond, calculator, dateToBeats, formatBeats, formatBeatsDate, formatBeatsTime, p, update, updateBeats, updateClock;
  p = function(obj) {
    var _ref;
    return (_ref = window.console) != null ? typeof _ref.debug === "function" ? _ref.debug(obj) : void 0 : void 0;
  };
  beatsPerHour = 1000.0 / 24.0;
  beatsPerMinute = 1000.0 / (24.0 * 60.0);
  beatsPerSecond = 1000.0 / (24.0 * 60.0 * 60.0);
  dateToBeats = function(date) {
    var beats, day, hours, minutes, month, seconds, year, _ref;
    _ref = [date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()], year = _ref[0], month = _ref[1], day = _ref[2], hours = _ref[3], minutes = _ref[4], seconds = _ref[5];
    beats = (hours * beatsPerHour) + (minutes * beatsPerMinute) + (seconds * beatsPerSecond);
    return [year, month, day, beats];
  };
  formatBeats = function(parts) {
    return "" + (formatBeatsDate(parts)) + " @" + (formatBeatsTime(parts));
  };
  formatBeatsDate = function(parts) {
    var beats, day, month, year;
    year = parts[0], month = parts[1], day = parts[2], beats = parts[3];
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    return "" + year + "-" + month + "m-" + day + "d";
  };
  formatBeatsTime = function(parts) {
    var beats, day, month, year;
    year = parts[0], month = parts[1], day = parts[2], beats = parts[3];
    return beats.toString().slice(0, 6);
  };
  updateBeats = function(parts) {
    var formatted;
    formatted = formatBeats(parts);
    $("#beats").html(formatted);
    return document.title = formatted;
  };
  updateClock = function(beats) {
    var counter_deg, counter_transform, digit_deg, digit_transform;
    digit_deg = (360.0 / 1000.0) * beats;
    digit_transform = "rotate(" + digit_deg + "deg)";
    counter_deg = 90.0;
    if (counter_deg <= 180.0) {
      counter_deg = 270.0;
    }
    counter_transform = "rotate(" + counter_deg + "deg)";
    $("#clock-digit").css({
      "-o-transform": digit_transform,
      "-moz-transform": digit_transform,
      "-webkit-transform": digit_transform,
      "transform": digit_transform
    });
    $("#clock-counter").css({
      "-o-transform": counter_transform,
      "-moz-transform": counter_transform,
      "-webkit-transform": counter_transform,
      "transform": counter_transform
    });
    return $("#clock-counter").text("@" + beats.toString().slice(0, 6));
  };
  update = function() {
    var now, parts;
    now = new Date(Date.now());
    parts = dateToBeats(now);
    updateClock(parts[3]);
    return updateBeats(parts);
  };
  calculator = function() {
    var divmod, key, major, minors, sub, syncBeats, syncTime, time, timeInput, value, zones, _ref, _ref2;
    timezoneJS.timezone.zoneFileBasePath = '/tz';
    timezoneJS.timezone.loadingScheme = timezoneJS.timezone.loadingSchemes.PRELOAD_ALL;
    timezoneJS.timezone.defaultZoneFile = ['africa', 'antarctica', 'asia', 'australasia', 'backward', 'etcetera', 'europe', 'northamerica', 'pacificnew', 'southamerica'];
    timezoneJS.timezone.init();
    zones = {};
    _ref = timezoneJS.timezone.zones;
    for (key in _ref) {
      value = _ref[key];
      _ref2 = key.split("/"), major = _ref2[0], sub = _ref2[1];
      zones[major] || (zones[major] = []);
      if (sub != null) {
        zones[major].push(sub);
      } else {
        zones[major].push(major);
      }
    }
    for (major in zones) {
      minors = zones[major];
      $("#timezone-major").append($("<option>", {
        value: major
      }).text(major));
    }
    $("#timezone-major").change(function(event) {
      var minor, _i, _len, _results;
      $("#timezone-minor").html('');
      minors = zones[$(event.target).val()];
      _results = [];
      for (_i = 0, _len = minors.length; _i < _len; _i++) {
        minor = minors[_i];
        _results.push($("#timezone-minor").append($("<option>", {
          value: minor
        }).text(minor)));
      }
      return _results;
    });
    time = new Date(Date.now());
    syncBeats = function() {
      var parts;
      parts = dateToBeats(time);
      $("#input-beats-date").val(formatBeatsDate(parts));
      return $("#input-beats-time").val(formatBeatsTime(parts));
    };
    syncTime = function() {
      $("#input-year").val(time.getFullYear());
      $("#input-month").val(time.getMonth() + 1);
      $("#input-day").val(time.getDate());
      $("#input-hour").val(time.getHours());
      $("#input-minute").val(time.getMinutes());
      return $("#input-second").val(time.getSeconds());
    };
    timeInput = function(sel, fun) {
      $(sel).change(function(event) {
        value = parseInt($(event.target).val(), 10);
        fun.apply(time, [value]);
        return syncBeats();
      });
      return $(sel).change();
    };
    timeInput("#input-year", time.setFullYear);
    timeInput("#input-month", function(m) {
      return this.setMonth(parseInt(m, 10) - 1);
    });
    timeInput("#input-day", time.setDate);
    timeInput("#input-hour", time.setHours);
    timeInput("#input-minute", time.setMinutes);
    timeInput("#input-second", time.setSeconds);
    $(".datepicker").datepicker({
      dateFormat: "yy.mm.dd",
      onSelect: function(dateText, inst) {
        var d, m, y, _ref;
        _ref = dateText.split("."), y = _ref[0], m = _ref[1], d = _ref[2];
        time.setFullYear(parseInt(y, 10));
        time.setMonth(parseInt(m, 10) - 1);
        time.setDate(parseInt(d, 10));
        return syncTime();
      }
    });
    divmod = function(l, r) {
      return [Math.floor(l / r), l % r];
    };
    return $("#input-beats-time").change(function(event) {
      var beats, h, m, r, s, _ref, _ref2, _ref3;
      beats = parseFloat($(event.target).val(), 10);
      if (beats > 1000) {
        beats = 1000.0;
      }
      if (beats < 0) {
        beats = 0.0;
      }
      _ref = divmod(beats, beatsPerHour), h = _ref[0], r = _ref[1];
      _ref2 = divmod(r, beatsPerMinute), m = _ref2[0], r = _ref2[1];
      _ref3 = divmod(r, beatsPerSecond), s = _ref3[0], r = _ref3[1];
      $("#input-hour").val(h);
      $("#input-minute").val(m);
      return $("#input-second").val(s);
    });
  };
  $(function() {
    if (location.pathname === "/calculator") {
      return calculator();
    } else {
      update();
      return setInterval(update, 1000);
    }
  });
}).call(this);
