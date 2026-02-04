export const GetDayFormatted = (s) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[s];
};

export const TwoDigitDates = (data) => {
  return data.toString().padStart(2, 0);
};

export const getFormattedDate = (dateString) => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  const ordinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${ordinalSuffix(day)}, ${month} ${year}`;
};
export const getFormattedDateWTY = (dateString) => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });

  const ordinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${ordinalSuffix(day)}, ${month}`;
};

export const getMonthName = (monthNumber) => {
  const monthNames = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[monthNumber] || "";
};

export const getTimeAgo = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);

  // Ensure difference is not negative
  const seconds = Math.max(0, Math.floor((now - past) / 1000));

  if (seconds < 60) return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;

  return past.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};


export const convertToAmPm = (time) => {
  if (!time || typeof time !== "string") return "";
  const [hours, minutes] = time.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) return "--"; // Handle invalid input
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for midnight
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

export const formatDateAndTime = (dateString) => {
  if (!dateString) return "Invalid Date";

  const date = new Date(dateString);
  return date
    .toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
    .replace(" , ", " ")
    .toUpperCase();
};

export const convertMinutesToHoursAndMinutes = (minutes) => {
  // Calculate hours
  var hours = Math.floor(minutes / 60);
  // Calculate remaining minutes
  var remainingMinutes = minutes % 60;

  return hours + " Hrs " + remainingMinutes + " Min";
};
