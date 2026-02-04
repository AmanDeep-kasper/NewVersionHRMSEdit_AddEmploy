const ABSENT_STATUSES = ["A", "UF", "N", "--"];

function applyWeekendSandwich(dates, year, month) {
    for (let i = 0; i < dates.length; i++) {
        const dateObj = new Date(year, month - 1, dates[i].date);
        if (dateObj.getDay() !== 5) continue; // Friday

        const fri = dates[i];
        const sat = dates[i + 1];
        const sun = dates[i + 2];
        const mon = dates[i + 3];

        if (!sat || !sun || !mon) continue;

        if (
            new Date(year, month - 1, sat.date).getDay() !== 6 ||
            new Date(year, month - 1, sun.date).getDay() !== 0 ||
            new Date(year, month - 1, mon.date).getDay() !== 1
        )
            continue;

        if (
            ABSENT_STATUSES.includes(fri.status) &&
            ABSENT_STATUSES.includes(mon.status)
        ) {
            [sat, sun].forEach((d) => {
                if (d.status === "W") {
                    d.isSandwich = true;
                    d.status = "S";
                    d.title = "Sandwich Leave";
                    d.color = "#8e24aa";
                }
            });
        }
    }
    return dates;
}

module.exports = applyWeekendSandwich;
