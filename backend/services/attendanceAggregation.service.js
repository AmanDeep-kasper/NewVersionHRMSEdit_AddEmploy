import AttendanceModel from "../models/attendanceModel";

export const getAttendanceByYearMonth = async ({
  employeeIds,
  year,
  month,
}) => {
  const data = await AttendanceModel.aggregate([
    { $match: { employeeObjID: { $in: employeeIds } } },
    { $unwind: "$years" },
    { $match: { "years.year": year } },
    { $unwind: "$years.months" },
    { $match: { "years.months.month": month } },
    {
      $group: {
        _id: "$employeeObjID",
        years: {
          $push: {
            year: "$years.year",
            months: ["$years.months"],
          },
        },
      },
    },
  ]);

  return AttendanceModel.populate(data, [
    { path: "_id", select: "_id" },
    { path: "years.months.dates.shifts", select: "name startTime endTime" },
    { path: "years.months.dates.holiday", select: "holidayName holidayType" },
    {
      path: "years.months.dates.LeaveApplication",
      select:
        "Leavetype leaveDuration reason status appliedOn approvedOn fromDate toDate employeeObjID updatedBy",
    },
  ]);
};
