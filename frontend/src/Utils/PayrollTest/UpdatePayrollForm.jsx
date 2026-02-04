import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../Pages/config/config";
import api from "../../Pages/config/api";

const UpdatePayrollForm = () => {
  const [year, setYear] = useState(new Date().getFullYear()); // Default to current year
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [employees, setEmployees] = useState([]); // Fetched employee data
  const [updates, setUpdates] = useState([]); // Payroll updates

  // Fetch employee data on component mount
 useEffect(() => {
  const fetchEmployees = async () => {
    try {

      const response = await api.get(`/api/employees`, {
      });

      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  fetchEmployees();
}, []);


  // Fetch employee attendance data for the selected year and month
  useEffect(() => {
  const fetchEmployeeAttendanceData = async () => {
    try {

      const response = await api.get(`/api/payroll`, {
        params: { year, month },
      });

      const attendanceData = response.data;

      const monthlyPayrollData = attendanceData
        .filter((data) => data.years.some((y) => y.year === year))
        .flatMap((data) =>
          data.years
            .filter((y) => y.year === year)
            .flatMap((y) =>
              y.months
                .filter((m) => m.month === month)
                .flatMap((m) => m.EmployeeAttandanceData)
            )
        );

      const initialUpdates = monthlyPayrollData.map((employee) => ({
        attendanceId: employee?.employeeObjID?._id || employee?._id,
        FullName:
          employee?.employeeObjID?.FirstName +
            " " +
            employee?.employeeObjID?.LastName || "",
        empID: employee?.employeeObjID?.empID || false,
        isAttChecked: employee?.isAttChecked || false,
        status: employee?.status || "",
        daysInMonth: employee?.daysInMonth || 0,
        absent: employee?.absent || 0,
        present: employee?.present || 0,
        halfday: employee?.halfday || 0,
        holiday: employee?.holiday || 0,
        paidLeaves: employee?.paidLeaves || 0,
        unpaidLeaves: employee?.unpaidLeaves || 0,
        NCNS: employee?.NCNS || 0,
        Sandwhich: employee?.Sandwhich || 0,
        totalPayableDays: employee?.totalPayableDays || 0,
        fixedBasic: employee?.fixedBasic || 0,
        fixedHRA: employee?.fixedHRA || 0,
        fixedConvenyance: employee?.fixedConvenyance || 0,
        fixedOthers: employee?.fixedOthers || 0,
        fixedTotalSalary: employee?.fixedTotalSalary || 0,
        actualBasic: employee?.actualBasic || 0,
        actualHRA: employee?.actualHRA || 0,
        actualConvenyance: employee?.actualConvenyance || 0,
        actualOthers: employee?.actualOthers || 0,
        actualTotalSalary: employee?.actualTotalSalary || 0,
        bonusAmount: employee?.bonusAmount || 0,
        bonusType: employee?.bonusType || "",
        insentiveAmount: employee?.insentiveAmount || 0,
        insentiveType: employee?.insentiveType || "",
        totalBNIAdditions: employee?.totalBNIAdditions || 0,
        additionComment: employee?.additionComment || "",
        salaryaAfterBonusAndInsentive:
          employee?.salaryaAfterBonusAndInsentive || 0,
        ArrearMonth: employee?.ArrearMonth || "",
        ArrearAmountPay: employee?.ArrearAmountPay || 0,
        ArrearAmountDeduct: employee?.ArrearAmountDeduct || 0,
        SalaryAfterArrearAmt: employee?.SalaryAfterArrearAmt || 0,
        arrearMessage: employee?.arrearMessage || "",
        PFDeduction: employee?.PFDeduction || 0,
        ESIDedeuction: employee?.ESIDedeuction || 0,
        TDSDeduction: employee?.TDSDeduction || 0,
        totalDeductionsAmount: employee?.totalDeductionsAmount || 0,
        deductionNotes: employee?.deductionNotes || "",
        salaryAfterPFESIandTDS: employee?.salaryAfterPFESIandTDS || 0,
        reimbursmentApplied: employee?.reimbursmentApplied || 0,
        reimbursmentApproved: employee?.reimbursmentApproved || 0,
        salaryAfterReimbursment: employee?.salaryAfterReimbursment || 0,
        advanceDuration: employee?.advanceDuration || "",
        PreviousAdvance: employee?.PreviousAdvance || 0,
        advanceAmountPay: employee?.advanceAmountPay || 0,
        advanceAmountDeduct: employee?.advanceAmountDeduct || 0,
        advanceBalance: employee?.advanceBalance || 0,
        netSalaryPayable: employee?.netSalaryPayable || 0,
        ReasionForAdvance: employee?.ReasionForAdvance || "",
      }));

      setUpdates(initialUpdates);
    } catch (error) {
      console.error("Error fetching employee attendance data:", error);
    }
  };

  fetchEmployeeAttendanceData();
}, [year, month]);


  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value));
  };

  const handleMonthChange = (e) => {
    setMonth(parseInt(e.target.value));
  };

  const handleUpdateChange = (e, index, field) => {
    const { value } = e.target;
    const numericValue = Number(value);
    const updatedUpdates = [...updates];
    updatedUpdates[index] = {
      ...updatedUpdates[index],
      [field]: numericValue,
    };
    if (
      field === "totalPayableDays" ||
      field === "fixedBasic" ||
      field === "fixedHRA" ||
      field === "fixedConvenyance" ||
      field === "fixedOthers" ||
      field === "fixedTotalSalary"
    ) {
      const {
        fixedBasic,
        fixedHRA,
        fixedConvenyance,
        fixedOthers,
        daysInMonth,
        totalPayableDays,
      } = updatedUpdates[index];

      updatedUpdates[index].actualBasic = (
        (fixedBasic / daysInMonth) *
        totalPayableDays
      ).toFixed();
      updatedUpdates[index].actualHRA = (
        (fixedHRA / daysInMonth) *
        totalPayableDays
      ).toFixed(2);
      updatedUpdates[index].actualConvenyance = (
        (fixedConvenyance / daysInMonth) *
        totalPayableDays
      ).toFixed(2);
      updatedUpdates[index].actualOthers = (
        (fixedOthers / daysInMonth) *
        totalPayableDays
      ).toFixed(2);
      updatedUpdates[index].actualTotalSalary = (
        (updatedUpdates[index].fixedTotalSalary / daysInMonth) *
        totalPayableDays
      ).toFixed(2);
    }

    setUpdates(updatedUpdates);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // Add year and month to each update
    const payload = updates.map((update) => ({
      ...update,
      year: parseInt(year),
      month: parseInt(month),
    }));


    const response = await api.put(
      `/api/payroll/update-bulk`,
      { updates: payload },
    );

    alert(response.data.message);
  } catch (error) {
    console.error("Error updating bulk data:", error);
    alert(error?.response?.data?.message || "Failed to update bulk data");
  }
};


  return (
    <form className="container-fluid" onSubmit={handleSubmit}>
      <div className="d-flex gap-4">
        <label className="d-flex flex-column">
          Year:
          <input
            className="form-control"
            type="number"
            value={year}
            onChange={handleYearChange}
            required
          />
        </label>
        <label className="d-flex flex-column">
          Month:
          <input
            className="form-control"
            type="number"
            value={month}
            onChange={handleMonthChange}
            required
          />
        </label>
      </div>
      {updates.map((update, index) => (
        <div className="d-flex align-items-center gap-4 my-1" key={index}>
          <label>
            Employee Name:
            <input
              className="form-control text-capitalize"
              type="text"
              value={update.FullName}
              disabled
            />
          </label>
          <label>
            Employee ID:
            <input
              className="form-control"
              type="text"
              value={update.empID}
              disabled
            />
          </label>
          <label>
            Basic:
            <input
              type="number"
              className="form-control"
              value={update.fixedBasic.toFixed(2)}
              onChange={(e) => handleUpdateChange(e, index, "fixedBasic")}
            />
          </label>
          <label>
            HRA:
            <input
              type="number"
              className="form-control"
              value={update.fixedHRA.toFixed(2)}
              onChange={(e) => handleUpdateChange(e, index, "fixedHRA")}
            />
          </label>
          <label>
            Convenyance:
            <input
              type="number"
              className="form-control"
              value={update.fixedConvenyance.toFixed(2)}
              onChange={(e) => handleUpdateChange(e, index, "fixedConvenyance")}
            />
          </label>
          <label>
            Other:
            <input
              type="number"
              className="form-control"
              value={update.fixedOthers.toFixed(2)}
              onChange={(e) => handleUpdateChange(e, index, "fixedOthers")}
            />
          </label>
          <label>
            Monthly Salary:
            <input
              type="number"
              className="form-control"
              value={update.fixedTotalSalary.toFixed(2)}
              onChange={(e) => handleUpdateChange(e, index, "fixedTotalSalary")}
            />
          </label>
          <label>
            Days In Month:
            <input
              type="number"
              className="form-control"
              value={update.daysInMonth}
              disabled
            />
          </label>
          <label>
            Payable Days:
            <input
              type="number"
              className="form-control"
              value={update.totalPayableDays}
              disabled
            />
          </label>
          <label>
            Actual Basic:
            <input
              type="number"
              className="form-control"
              value={(
                (update.fixedBasic / update.daysInMonth) *
                update.totalPayableDays
              ).toFixed(2)}
              readOnly
            />
          </label>
          <label>
            Actual HRA:
            <input
              type="number"
              className="form-control"
              value={(
                (update.fixedHRA / update.daysInMonth) *
                update.totalPayableDays
              ).toFixed(2)}
              readOnly
            />
          </label>
          <label>
            Actual Convenyance:
            <input
              type="number"
              className="form-control"
              value={(
                (update.fixedConvenyance / update.daysInMonth) *
                update.totalPayableDays
              ).toFixed(2)}
              readOnly
            />
          </label>
          <label>
            Actual Others:
            <input
              type="number"
              className="form-control"
              value={(
                (update.fixedOthers / update.daysInMonth) *
                update.totalPayableDays
              ).toFixed(2)}
              readOnly
            />
          </label>
          <label>
            Actual Total Salary:
            <input
              type="number"
              className="form-control"
              value={(
                (update.fixedTotalSalary / update.daysInMonth) *
                update.totalPayableDays
              ).toFixed(2)}
              readOnly
            />
          </label>
        </div>
      ))}
      <button className="btn btn-primary" type="submit">
        Update Bulk Data
      </button>
    </form>
  );
};

export default UpdatePayrollForm;
