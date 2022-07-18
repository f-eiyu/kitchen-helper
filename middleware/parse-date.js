// converts a Date object into a more human-readable string
const parseDate = async (toParse, useMilitaryTime = false) => {
  const today = new Date();

  // calculate the number of calendar days between the input and today. first,
  // remove hms info so we're dealing with whole days only.
  const startDate = new Date(
    toParse.getFullYear(),
    toParse.getMonth(),
    toParse.getDate());
  const endDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )
  // now, subtract and divide by the number of milliseconds in a day.
  const ONE_DAY_MS = 1000 * 60 * 60 * 24;
  const dayDiff = Math.floor((endDate - startDate) / ONE_DAY_MS);

  let outputDate = "";

  // render the input date differently based on when it is.
  // if the date is today or yesterday, simply display the date as "today" or
  // "yesterday" respectively.
  if (dayDiff === 0) { outputDate = "today"; }
  else if (dayDiff === 1) { outputDate = "yesterday"; }
  // if the date is within a week, display the weekday name. specifying > 0
  // causes negative date differences to fall through, producing a slightly
  // more coherent message if that error does somehow occur
  else if (dayDiff > 0 && dayDiff < 7) {
    const WEEKDAYS = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    outputDate = WEEKDAYS[toParse.getDay()];
  }
  // otherwise, display how long ago the input date was
  else { outputDate = `${today.getDate() - toParse} days ago`; }

  // build the timestamp
  let outMins = "";
  let outHrs = "";
  let outPostfix = "";
  
  outMins = toParse.getMinutes();
  if (outMins >= 0 && outMins <= 9) {
    outMins = "0" + outMins;
  }

  if (useMilitaryTime) {
    outHrs = toParse.getHours();
  }
  else { // convert the 0-23 hour value into proper 12-hour time
    let hour = toParse.getHours();
    if (hour > 11) {
      hour -= 12;
      outPostfix = " PM";
    }
    else { outPostfix = " AM"; }

    if (hour === 0) { hour = 12; }
    outHrs = hour;
  }

  const outputTime = `${outHrs}:${outMins}${outPostfix}`;

  const output = `${outputDate}, at ${outputTime}`;
  return output;
}

module.exports = parseDate;