import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../Pages/config/config";
import api from "../../Pages/config/api";

const BulkUpdateForm = () => {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(2);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  
useEffect(() => {
  const fetchEmployeeAttendanceData = async () => {
    if (!year || !month) {
      console.warn("Year and month are required to fetch attendance data.");
      return;
    }

    setLoading(true);
    try {

      const response = await api.get(`/api/payroll`, {
      });

      const payrollRecords = response.data;

      // ✅ Filter data for the selected year and month
      const filteredRecords = payrollRecords
        .filter((record) => record.years.some((y) => y.year === year))
        .flatMap((record) =>
          record.years
            .filter((y) => y.year === year)
            .flatMap((y) =>
              y.months
                .filter((m) => m.month === month)
                .flatMap((m) => m.EmployeeAttandanceData)
            )
        );

      // ✅ Prepare initial updates
      const initialUpdates = filteredRecords.map((employee) => ({
        employeeObjID: employee?.employeeObjID?._id || employee?._id,
        FullName:
          (employee?.employeeObjID?.FirstName || "") +
          " " +
          (employee?.employeeObjID?.LastName || ""),
        BasicSalary:
          employee?.employeeObjID?.salary?.slice(-1)[0]?.BasicSalary || 0,
        BasicHRA:
          employee?.employeeObjID?.salary?.slice(-1)[0]?.HRASalary || 0,
        BasicConvenyance:
          employee?.employeeObjID?.salary?.slice(-1)[0]
            ?.ConvenyanceAllowance || 0,
        BasicOthers:
          employee?.employeeObjID?.salary?.slice(-1)[0]
            ?.ConvenyanceAllowance || 0,
        FixedMonthlySalary:
          employee?.employeeObjID?.salary?.slice(-1)[0]?.totalSalary || 0,
        empID: employee?.employeeObjID?.empID || "",
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
      alert("Failed to fetch payroll data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  fetchEmployeeAttendanceData();
}, [year, month]);


  const handleChange = (index, field, value) => {
    const newUpdates = [...updates];
    newUpdates[index][field] = value;
    setUpdates(newUpdates);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!year || !month || updates.length === 0) {
    alert("Please provide year, month, and at least one update before submitting.");
    return;
  }

  setUploading(true);
  try {

    await api.post(
      `/api/payroll/updateBulkData`,
      { year, month, updates },
    );

    alert("Bulk update successful!");
    // ✅ Optionally reset state after success
    setUpdates([]);
  } catch (error) {
    console.error("Error during bulk update:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Bulk update failed. Please try again.");
  } finally {
    setUploading(false);
  }
};


  return (
    <div className="container-fluid p-3">
      {loading && <div className="alert alert-info">Loading data...</div>}
      {uploading && (
        <div className="alert alert-warning">Uploading updates...</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex gap-3 align-items-center">
            <div className="d-flex flex-column">
              <label>Year:</label>
              <input
                className="form-control"
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                min="2000"
                max="2100"
              />
            </div>
            <div className="d-flex flex-column">
              <label>Month:</label>
              <input
                className="form-control"
                type="number"
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                min="1"
                max="12"
              />
            </div>
          </div>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Submit"}
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Employee ID</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Days In Month</th>
              <th>Basic Salary</th>
            </tr>
          </thead>
          <tbody>
            {updates.map((update, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <input type="text" value={update.FullName} disabled />
                </td>
                <td>
                  <input type="text" value={update.empID} disabled />
                </td>
                <td>
                  <input
                    type="number"
                    value={update.present}
                    onChange={(e) =>
                      handleChange(index, "present", parseInt(e.target.value))
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={update.absent}
                    onChange={(e) =>
                      handleChange(index, "absent", parseInt(e.target.value))
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={update.daysInMonth}
                    onChange={(e) =>
                      handleChange(
                        index,
                        "daysInMonth",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={update.BasicSalary}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value);
                      if (newValue !== update.BasicSalary) {
                        handleChange(index, "BasicSalary", newValue);
                      } else {
                        handleChange(index, "BasicSalary", update.BasicSalary);
                      }
                    }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={update.actualTotalSalary}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value);
                      if (newValue !== update.actualTotalSalary) {
                        handleChange(index, "actualTotalSalary", newValue);
                      } else {
                        handleChange(
                          index,
                          "actualTotalSalary",
                          update.actualTotalSalary
                        ); // Retain the previous value if not changed
                      }
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default BulkUpdateForm;
