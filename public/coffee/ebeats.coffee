p = (obj) ->
  window.console?.debug?(obj)

beatsPerHour = 1000.0 / 24.0
beatsPerMinute = 1000.0 / (24.0 * 60.0)
beatsPerSecond = 1000.0 / (24.0 * 60.0 * 60.0)

dateToBeats = (date) ->
  [year, month, day, hours, minutes, seconds] = [
    date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(),
    date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(),
  ]
  beats = (hours * beatsPerHour) +
          (minutes * beatsPerMinute) +
          (seconds * beatsPerSecond)
  [year, month, day, beats]

dateToCET = (date) ->
  utc = Date.UTC(
    date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
    date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(),
  )
  new Date(utc)

formatBeats = (parts) ->
  "d#{formatBeatsDate(parts)} @#{formatBeatsTime(parts)}"

formatBeatsDate = (parts) ->
  [year, month, day, beats] = parts
  month = "0#{month}" if month < 10
  day = "0#{day}" if day < 10
  "#{day}.#{month}.#{year}"

formatBeatsTime = (parts) ->
  [year, month, day, beats] = parts
  beats.toString().slice(0, 6)

updateBeats = (parts) ->
  $("#beats").html(formatBeats(parts))

updateClock = (beats) ->
  digit_deg = (360.0 / 1000.0) * beats
  digit_transform = "rotate(#{digit_deg}deg)"
  counter_deg = 90.0
  counter_deg = 270.0 if counter_deg <= 180.0
  counter_transform = "rotate(#{counter_deg}deg)"

  $("#clock-digit").css(
    "-o-transform": digit_transform,
    "-moz-transform": digit_transform,
    "-webkit-transform": digit_transform,
    "transform": digit_transform,
  )
  $("#clock-counter").css(
    "-o-transform": counter_transform,
    "-moz-transform": counter_transform,
    "-webkit-transform": counter_transform,
    "transform": counter_transform,
  )
  $("#clock-counter").text("@" + beats.toString().slice(0, 6))

update = ->
  now = new Date(Date.now())
  parts = dateToBeats(dateToCET(now))
  updateClock(parts[3])
  updateBeats(parts)

calculator = ->
  timezoneJS.timezone.zoneFileBasePath = '/tz'
  timezoneJS.timezone.loadingScheme = timezoneJS.timezone.loadingSchemes.PRELOAD_ALL
  timezoneJS.timezone.defaultZoneFile = ['africa', 'antarctica', 'asia',
    'australasia', 'backward', 'etcetera', 'europe',
    'northamerica', 'pacificnew', 'southamerica']
  timezoneJS.timezone.init()

  zones = {}
  for key, value of timezoneJS.timezone.zones
    [major, sub] = key.split("/")
    zones[major] ||= []
    if sub?
      zones[major].push(sub)
    else
      zones[major].push(major)

  for major, minors of zones
    $("#timezone-major").append($("<option>", value: major).text(major))

  $("#timezone-major").change (event) ->
    $("#timezone-minor").html('')
    minors = zones[$(event.target).val()]
    for minor in minors
      $("#timezone-minor").append($("<option>", value: minor).text(minor))

  time = new Date(Date.now())

  syncBeats = ->
    parts = dateToBeats(dateToCET(time))
    $("#input-beats-date").val(formatBeatsDate(parts))
    $("#input-beats-time").val(formatBeatsTime(parts))

  syncTime = ->
    $("#input-year").val(time.getFullYear())
    $("#input-month").val(time.getMonth() + 1)
    $("#input-day").val(time.getDate())
    $("#input-hour").val(time.getHours())
    $("#input-minute").val(time.getMinutes())
    $("#input-second").val(time.getSeconds())

  timeInput = (sel, fun) ->
    $(sel).change (event) ->
      value = parseInt($(event.target).val(), 10)
      fun.apply(time, [value])
      syncBeats()
    $(sel).change()

  timeInput "#input-year",   time.setFullYear
  timeInput "#input-month",  (m) -> this.setMonth(parseInt(m, 10) - 1)
  timeInput "#input-day",    time.setDate
  timeInput "#input-hour",   time.setHours
  timeInput "#input-minute", time.setMinutes
  timeInput "#input-second", time.setSeconds

  $(".datepicker").datepicker(
    dateFormat: "yy.mm.dd",
    onSelect: (dateText, inst) ->
      [y, m, d] = dateText.split(".")
      time.setFullYear(parseInt(y, 10))
      time.setMonth(parseInt(m, 10) - 1)
      time.setDate(parseInt(d, 10))
      syncTime()
  )

  divmod = (l, r) ->
    [Math.floor(l / r), l % r]

  $("#input-beats-time").change (event) ->
    beats = parseFloat($(event.target).val(), 10)
    beats = 1000.0 if beats > 1000
    beats = 0.0 if beats < 0
    [h, r] = divmod(beats, beatsPerHour)
    [m, r] = divmod(r, beatsPerMinute)
    [s, r] = divmod(r, beatsPerSecond)
    $("#input-hour").val(h)
    $("#input-minute").val(m)
    $("#input-second").val(s)

$ ->
  if location.pathname == "/calculator"
    calculator()
  else
    update()
    setInterval(update, 1000)
