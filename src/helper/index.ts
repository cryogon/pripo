const timeFormatter = new Intl.RelativeTimeFormat("en", {
  localeMatcher: "best fit",
  numeric: "always",
  style: "long",
});
export function getTimeDifference(oldtime: Date, currtime: Date) {
  const timeInSeconds = (currtime.getTime() - oldtime.getTime()) / 1000; // Converted Miliseconds to seconds
  const timeInMinutes = timeInSeconds / 60;
  const timeInHours = timeInMinutes / 60;
  const timeInDays = timeInHours / 24;
  if (timeInSeconds < 60) {
    return timeFormatter.format(-Math.round(timeInSeconds), "seconds");
  }
  if (timeInMinutes < 60) {
    return timeFormatter.format(-Math.round(timeInMinutes), "minute");
  }
  if (timeInHours < 24) {
    return timeFormatter.format(-Math.round(timeInHours), "hour");
  }
  if (timeInDays < 30) {
    return timeFormatter.format(-Math.round(timeInDays), "day");
  }
  return timeFormatter.format(-Math.round(timeInDays / 30), "month");
}
