$(function(){
  var hourRatio = 1000.0 / 24.0,
      minuteRatio = 1000.0 / (24.0 * 60.0),
      secondRatio = 1000.0 / (24.0 * 60.0 * 60.0);

  var dateToBeats = function(date){
    var year    = date.getUTCFullYear(),
        month   = date.getUTCMonth() + 1,
        day     = date.getUTCDate(),
        hours   = date.getUTCHours(),
        minutes = date.getUTCMinutes(),
        seconds = date.getUTCSeconds();
        beats = (hours * hourRatio) + (minutes * minuteRatio) + (seconds * secondRatio);
    return [year, month, day, beats]
  }

  var dateToCET = function(date){
    var utc = Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
      date.getUTCMilliseconds()
    )
    utc = utc + (60 * 60 * 1000)
    return new Date(utc)
  }

  var formatBeats = function(parts){
    var year = parts[0], month = parts[1], day = parts[2], beats = parts[3];

    if(month < 10){ month = "0" + month; }
    if(day < 10){ day = "0" + day; }
      
    var out = "d" + [day, month, year].join(".");
    out = out + " @" + beats.toString().slice(0, 6);
    return out
  }

  var updateBeats = function(parts){
    $("#beats").html(formatBeats(parts));
  }

  var updateClock = function(beats){
    var digit_deg = (360.0 / 1000.0) * beats;
    var digit_transform = "rotate(" + digit_deg + "deg)";
    var counter_deg;
    if(digit_deg > 180.0){ counter_deg = 90.0; } else { counter_deg = 270.0; }
    var counter_transform = "rotate(" + counter_deg + "deg)";

    $("#clock-digit").css({
      "-o-transform": digit_transform,
      "-moz-transform": digit_transform,
      "-webkit-transform": digit_transform,
      "transform": digit_transform,
    });
    $("#clock-counter").css({
      "-o-transform": counter_transform,
      "-moz-transform": counter_transform,
      "-webkit-transform": counter_transform,
      "transform": counter_transform,
    });
    $("#clock-counter").text("@" + beats.toString().slice(0, 6));
  }

  var update = function(){
    var parts = dateToBeats(dateToCET(new Date(Date.now())));
    updateClock(parts[3]);
    updateBeats(parts);
  }

  update();
  setInterval(update, 1000);

  var calc_time = new Date(Date.now());

  $("#input-beats").change(function(event){
    var beats = parseInt($(event.target).val(), 10);
  });

  $("#input-timespec").change(function(event){
    var date = new Date(Date.parse($(event.target).val())),
        parts = dateToBeats(dateToCET(date));
    $("#input-beats").val(formatBeats(parts));
  })

  $("#input-year").change(function(event){
    calc_time.setFullYear($(event.target).val());
    $("#input-timespec").val(calc_time).change();
  });
  $("#input-month").change(function(event){
    calc_time.setMonth(parseInt($(event.target).val(), 10) - 1);
    $("#input-timespec").val(calc_time).change();
    $(event.target).val(calc_time.getMonth() + 1);
  });
  $("#input-day").change(function(event){
    calc_time.setDate($(event.target).val());
    $("#input-timespec").val(calc_time).change();
  });
  $("#input-hour").change(function(event){
    calc_time.setHours($(event.target).val());
    $("#input-timespec").val(calc_time).change();
  });
  $("#input-minute").change(function(event){
    calc_time.setMinutes($(event.target).val());
    $("#input-timespec").val(calc_time).change();
  });
  $("#input-second").change(function(event){
    calc_time.setSeconds($(event.target).val());
    $("#input-timespec").val(calc_time).change();
  });

  $("#datepicker").datepicker({
    dateFormat: "yy-mm-dd",
    onSelect: function(dateText, inst){
      var ymd = dateText.split("-");
      var y = ymd[0], m = ymd[1], d = ymd[2];
      calc_time.setFullYear(y);
      calc_time.setMonth(m);
      calc_time.setDate(d);
      $("#input-timespec").val(calc_time).change();
    }
  });

  $("#input-time").change(function(event){
    var hhmm = $(event.target).val().split(":");
    var h = parseInt(hhmm[0], 10), m = parseInt(hhmm[1], 10);
    calc_time.setHours(h);
    calc_time.setMinutes(m);
    $("#input-timespec").val(calc_time).change();
  });
})
