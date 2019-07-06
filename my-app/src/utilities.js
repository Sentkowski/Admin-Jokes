export function formatDate(time) {
  if (time === 0) {
    return "Just now";
  } else if (time === 1) {
    return "1 hour ago";
  } else if (time < 24) {
    return time + " hours ago";
  } else if (time >= 24 && time < 48) {
    return "1 day ago";
  } else {
    return Math.floor(time / 24) + " days ago";
  }
}

export function giveRandom(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function capFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}