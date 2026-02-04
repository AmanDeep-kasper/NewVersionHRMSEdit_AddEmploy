/**
 * Attendance Totals Calculator
 * --------------------------------
 * STATUS MEANING:
 * P  = Present
 * H  = Half Day (0.5 present)
 * VH = Paid Half Leave (0.5 present + 0.5 paid leave)
 * VF = Paid Full Leave
 * UF = Unpaid Full Leave
 * UH = Unpaid Half Leave
 * W  = Week Off
 * O  = Holiday
 * N  = NCNS (No Call No Show)
 * S  = Sandwich
 * A  = Absent
 * -- = No Data
 */

const calculateAttendanceTotals = (dates = [], daysInMonth = 0) => {
  const totals = dates.reduce(
    (acc, d) => {
      switch (d.status) {
        case "P":
          acc.present += 1;
          break;

        case "H":
          acc.present += 0.5;
          acc.halfday += 1;
          break;

        case "VH":
          acc.present += 0.5;
          acc.paidLeaves += 0.5;
          break;

        case "VF":
          acc.paidLeaves += 1;
          break;

        case "UF":
          acc.unpaidLeaves += 1;
          break;

        case "UH":
          acc.unpaidLeaves += 0.5;
          break;

        case "W":
          acc.weekoff += 1;
          break;

        case "O":
          acc.holiday += 1;
          break;

        case "S":
          acc.Sandwich += 1;
          break;

        case "N":
          acc.NCNS += 1;
          break;

        case "A":
        case "--":
          acc.absent += 1;
          break;
      }
      return acc;
    },
    {
      totalDays: daysInMonth,
      present: 0,
      absent: 0,
      weekoff: 0,
      holiday: 0,
      halfday: 0,
      paidLeaves: 0,
      unpaidLeaves: 0,
      NCNS: 0,
      Sandwich: 0,
    }
  );

  // ✅ FINAL PAYABLE DAYS (Approved HR Logic)
  totals.totalPayableDays = Math.max(
    totals.present +
      totals.weekoff +
      totals.holiday +
      totals.paidLeaves +
      totals.Sandwich -
      totals.NCNS,
    0
  );

  return totals;
};

module.exports = calculateAttendanceTotals;
