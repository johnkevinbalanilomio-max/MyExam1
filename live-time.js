const clockElements = document.querySelectorAll("[data-live-clock]");
const yearElements = document.querySelectorAll("[data-current-year]");
const academicYearElements = document.querySelectorAll("[data-academic-year]");
const calendarMonth = document.querySelector("[data-live-month]");
const calendarBody = document.querySelector(".cal tbody");

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric"
});
const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit"
});

function updateClock(now) {
  const date = dateFormatter.format(now).replace(/,/g, "").toLocaleUpperCase();
  const time = timeFormatter.format(now);

  clockElements.forEach((element) => {
    element.textContent = `${date} \u2022 ${time}`;
    element.dateTime = now.toISOString();
  });
}

function updateYears(now) {
  const year = now.getFullYear();
  yearElements.forEach((element) => {
    element.textContent = year;
  });

  const schoolYearStart = now.getMonth() >= 7 ? year : year - 1;
  academicYearElements.forEach((element) => {
    element.textContent = `${schoolYearStart}-${schoolYearStart + 1}`;
  });
}

function formatRelativeTime(elapsedMilliseconds) {
  const elapsedMinutes = Math.floor(elapsedMilliseconds / 60000);

  if (elapsedMinutes < 1) {
    return "just now";
  }
  if (elapsedMinutes < 60) {
    return `${elapsedMinutes} ${elapsedMinutes === 1 ? "minute" : "minutes"} ago`;
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) {
    return `${elapsedHours} ${elapsedHours === 1 ? "hour" : "hours"} ago`;
  }

  const elapsedDays = Math.floor(elapsedHours / 24);
  return `${elapsedDays} ${elapsedDays === 1 ? "day" : "days"} ago`;
}

const relativeTimes = [...document.querySelectorAll(".time")].flatMap((element) => {
  const age = element.textContent.trim().match(/^(\d+)\s+(minute|hour|day)s?\s+ago$/i);
  if (!age) {
    return [];
  }

  const units = {
    minute: 60000,
    hour: 3600000,
    day: 86400000
  };
  const publishedAt = new Date(Date.now() - Number(age[1]) * units[age[2].toLowerCase()]);
  element.dateTime = publishedAt.toISOString();
  return [{ element, publishedAt }];
});

function updateRelativeTimes(now) {
  relativeTimes.forEach(({ element, publishedAt }) => {
    element.textContent = formatRelativeTime(Math.max(0, now - publishedAt));
  });
}

let renderedCalendarDate = "";

function updateCalendar(now) {
  if (!calendarMonth || !calendarBody) {
    return;
  }

  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const calendarDate = `${year}-${month}-${today}`;
  if (calendarDate === renderedCalendarDate) {
    return;
  }
  renderedCalendarDate = calendarDate;

  calendarMonth.textContent = new Intl.DateTimeFormat(undefined, {
    month: "long",
    year: "numeric"
  }).format(now);

  const weekdayRow = calendarBody.querySelector(".dow");
  if (!weekdayRow) {
    return;
  }

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPreviousMonth = new Date(year, month, 0).getDate();
  const weekCount = Math.ceil((firstWeekday + daysInMonth) / 7);
  const rows = [weekdayRow];

  for (let week = 0; week < weekCount; week += 1) {
    const row = document.createElement("tr");

    for (let weekday = 0; weekday < 7; weekday += 1) {
      const cellIndex = week * 7 + weekday;
      const day = cellIndex - firstWeekday + 1;
      const cell = document.createElement("td");

      if (day < 1) {
        cell.classList.add("out");
        cell.textContent = daysInPreviousMonth + day;
      } else if (day > daysInMonth) {
        cell.classList.add("out");
        cell.textContent = day - daysInMonth;
      } else {
        cell.textContent = day;
        if (day === today) {
          cell.classList.add("mark");
          cell.setAttribute("aria-current", "date");
        }
      }

      row.append(cell);
    }

    rows.push(row);
  }

  calendarBody.replaceChildren(...rows);
}

function updateLiveValues() {
  const now = new Date();
  updateClock(now);
  updateYears(now);
  updateRelativeTimes(now);
  updateCalendar(now);
}

updateLiveValues();
window.setInterval(updateLiveValues, 1000);
