const PayrollRecords = require("../models/PayrollRecordsModel");

const addPayrollRecord = async (req, res) => {
  try {
    const { year, month, employeeObjID, employeeData } = req.body;

    let payrollRecord = await PayrollRecords.findOne();

    // If no document exists, create a new one
    if (!payrollRecord) {
      payrollRecord = new PayrollRecords({ years: [] });
    }

    // Find year in the record
    let yearIndex = payrollRecord.years.findIndex((y) => y.year === year);
    if (yearIndex === -1) {
      payrollRecord.years.push({ year, months: [] });
      yearIndex = payrollRecord.years.length - 1;
    }

    // Find month in the selected year
    let monthIndex = payrollRecord.years[yearIndex].months.findIndex(
      (m) => m.month === month
    );
    if (monthIndex === -1) {
      payrollRecord.years[yearIndex].months.push({
        month,
        EmployeeAttandanceData: [],
      });
      monthIndex = payrollRecord.years[yearIndex].months.length - 1;
    }

    // Check if employeeObjID already exists in EmployeeAttandanceData
    let employeeExists = payrollRecord.years[yearIndex].months[
      monthIndex
    ].EmployeeAttandanceData.some(
      (emp) => emp.employeeObjID.toString() === employeeObjID
    );

    if (!employeeExists) {
      payrollRecord.years[yearIndex].months[
        monthIndex
      ].EmployeeAttandanceData.push({
        employeeObjID,
        ...employeeData,
      });
    }

    await payrollRecord.save();
    res
      .status(200)
      .json({ message: "Payroll record added successfully", payrollRecord });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const addPayrollRecordsMany = async (req, res) => {
  try {
    const { records } = req.body;

    if (!Array.isArray(records)) {
      return res.status(400).json({ message: "Records should be an array" });
    }

    let payrollRecord = await PayrollRecords.findOne();

    // If no document exists, create a new one
    if (!payrollRecord) {
      payrollRecord = new PayrollRecords({ years: [] });
    }

    records.forEach((record) => {
      const { year, month, employeeObjID, employeeData } = record;

      // Find year in the record
      let yearIndex = payrollRecord.years.findIndex((y) => y.year === year);
      if (yearIndex === -1) {
        payrollRecord.years.push({ year, months: [] });
        yearIndex = payrollRecord.years.length - 1;
      }

      // Find month in the selected year
      let monthIndex = payrollRecord.years[yearIndex].months.findIndex(
        (m) => m.month === month
      );
      if (monthIndex === -1) {
        payrollRecord.years[yearIndex].months.push({
          month,
          EmployeeAttandanceData: [],
        });
        monthIndex = payrollRecord.years[yearIndex].months.length - 1;
      }

      // Add or update EmployeeAttandanceData
      let employeeIndex = payrollRecord.years[yearIndex].months[
        monthIndex
      ].EmployeeAttandanceData.findIndex(
        (emp) => emp.employeeObjID.toString() === employeeObjID
      );

      if (employeeIndex === -1) {
        payrollRecord.years[yearIndex].months[
          monthIndex
        ].EmployeeAttandanceData.push({ employeeObjID, ...employeeData });
      } else {
        payrollRecord.years[yearIndex].months[
          monthIndex
        ].EmployeeAttandanceData[employeeIndex] = {
          employeeObjID,
          ...employeeData,
        };
      }
    });

    await payrollRecord.save();
    res.status(200).json({ message: "Payroll records added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all Payroll Records
const getAllPayrollRecords = async (req, res) => {
  try {
    const payrollRecords = await PayrollRecords.find().populate({
      path: "years.months.EmployeeAttandanceData.employeeObjID",
      select: "FirstName LastName profile  empID salary isFullandFinal",
      populate: {
        path: "salary",
      },
    });
    res.status(200).json(payrollRecords);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payroll records", error });
  }
};

// Get Payroll Records by Year
const getPayrollRecordsByYear = async (req, res) => {
  try {
    const { year } = req.params;
    const payrollRecords = await PayrollRecords.findOne({
      "years.year": year,
    }).populate({
      path: "years.months.EmployeeAttandanceData.employeeObjID",
      select: "FirstName LastName profile empID", // Select only required fields
    });
    if (!payrollRecords) {
      return res
        .status(404)
        .json({ message: "Payroll records not found for this year" });
    }
    res.status(200).json(payrollRecords);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payroll records", error });
  }
};

// Get Payroll Records by Month
const getPayrollRecordsByMonth = async (req, res) => {
  try {
    const { year, month } = req.params;
    const payrollRecords = await PayrollRecords.findOne(
      { "years.year": year, "years.months.month": month },
      { "years.$": 1 } // Projection to get only the required year data
    ).populate({
      path: "years.months.EmployeeAttandanceData.employeeObjID empID",
      select: "FirstName LastName profile", // Select only required fields
    });

    if (!payrollRecords) {
      return res
        .status(404)
        .json({ message: "Payroll records not found for this month" });
    }
    res.status(200).json(payrollRecords);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payroll records", error });
  }
};

// Get Payroll Records by Employee
const getPayrollRecordsByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const payrollRecords = await PayrollRecords.find({
      "years.months.EmployeeAttandanceData.employeeObjID": employeeId,
    }).populate({
      path: "years.months.EmployeeAttandanceData.employeeObjID empID",
      select: "FirstName LastName profile", // Select only required fields
    });

    if (!payrollRecords || payrollRecords.length === 0) {
      return res
        .status(404)
        .json({ message: "Payroll records not found for this employee" });
    }
    res.status(200).json(payrollRecords);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payroll records", error });
  }
};

const updateAttendanceChecked = async (req, res) => {
  try {
    const { year, month } = req.body;

    const payrollRecord = await PayrollRecords.findOneAndUpdate(
      { "years.year": year, "years.months.month": month },
      { $set: { "years.$.months.$.isAttandanceChecked": true } },
      { new: true }
    );

    if (!payrollRecord) {
      return res.status(404).json({ message: "Payroll record not found" });
    }

    res.status(200).json(payrollRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePayrollRecordsMany = async (req, res) => {
  try {
    const { records } = req.body;

    if (!Array.isArray(records)) {
      return res.status(400).json({ message: "Records should be an array" });
    }

    // Find the existing payroll record
    let payrollRecord = await PayrollRecords.findOne();

    if (!payrollRecord) {
      return res.status(404).json({ message: "No payroll records found" });
    }

    // Iterate through the records to update
    records.forEach((record) => {
      const { year, months } = record;

      // Find the year in the payroll record
      let yearIndex = payrollRecord.years.findIndex((y) => y.year === year);
      if (yearIndex === -1) {
        // If the year doesn't exist, create it
        payrollRecord.years.push({ year, months: [] });
        yearIndex = payrollRecord.years.length - 1;
      }

      // Iterate through the months in the record
      months.forEach((monthData) => {
        const { month, EmployeeAttendanceData } = monthData;

        // Find the month in the selected year
        let monthIndex = payrollRecord.years[yearIndex].months.findIndex(
          (m) => m.month === month
        );
        if (monthIndex === -1) {
          // If the month doesn't exist, create it
          payrollRecord.years[yearIndex].months.push({
            month,
            EmployeeAttandanceData: [],
          });
          monthIndex = payrollRecord.years[yearIndex].months.length - 1;
        }

        // Iterate through the EmployeeAttendanceData
        EmployeeAttendanceData.forEach((employeeData) => {
          const { employeeObjID, ...data } = employeeData;

          // Find the employee in the selected month
          let employeeIndex = payrollRecord.years[yearIndex].months[
            monthIndex
          ].EmployeeAttandanceData.findIndex(
            (emp) => emp.employeeObjID.toString() === employeeObjID
          );

          if (employeeIndex === -1) {
            // If the employee doesn't exist, add them
            payrollRecord.years[yearIndex].months[
              monthIndex
            ].EmployeeAttandanceData.push({ employeeObjID, ...data });
          } else {
            // If the employee exists, update their data
            payrollRecord.years[yearIndex].months[
              monthIndex
            ].EmployeeAttandanceData[employeeIndex] = {
              ...payrollRecord.years[yearIndex].months[monthIndex]
                .EmployeeAttandanceData[employeeIndex],
              ...data, // Override with new data
            };
          }
        });
      });
    });

    // Save the updated payroll record
    await payrollRecord.save();
    res.status(200).json({ message: "Payroll records updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getPayrollRecords = async (req, res) => {
  try {
    const { year, month, employeeObjID } = req.query;

    // Find the payroll record
    const payrollRecord = await PayrollRecords.findOne({
      "years.year": year,
      "years.months.month": month,
      "years.months.EmployeeAttandanceData.employeeObjID": employeeObjID,
    });

    if (!payrollRecord) {
      return res.status(404).json({ message: "No payroll records found" });
    }

    // Extract the specific employee's data
    const yearData = payrollRecord.years.find((y) => y.year === year);
    const monthData = yearData.months.find((m) => m.month === month);
    const employeeData = monthData.EmployeeAttandanceData.find(
      (emp) => emp.employeeObjID.toString() === employeeObjID
    );

    res.status(200).json({ employeeData });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const updateBulkEmployeeAttendanceData = async (req, res) => {
  const { updates } = req.body;

  try {
    const bulkOps = updates.map((update) => {
      // Create an update object with only the fields that need to be updated
      const updateFields = {};
      for (const key in update) {
        if (
          key !== "employeeObjID" &&
          key !== "year" &&
          key !== "month" &&
          key !== "updatedAt"
        ) {
          updateFields[
            `years.$[2025].months.$[2].EmployeeAttandanceData.$[employee].${key}`
          ] = update[key];
        }
      }

      return {
        updateOne: {
          filter: {
            "years.year": update.year, // Filter by year
            "years.months.month": update.month, // Filter by month
            "years.months.EmployeeAttandanceData.employeeObjID":
              update.employeeObjID, // Filter by employeeObjID
          },
          update: {
            $set: updateFields, // Update only the specified fields
          },
          arrayFilters: [
            { "year.year": update.year }, // Filter for the correct year
            { "month.month": update.month }, // Filter for the correct month
            { "employee.employeeObjID": update.employeeObjID }, // Filter for the correct employee
          ],
        },
      };
    });

    // Execute the bulk write operation
    const result = await PayrollRecords.bulkWrite(bulkOps);

    res.status(200).json({ message: "Bulk update successful", result });
  } catch (error) {
    console.error("Error updating bulk data:", error);
    res
      .status(500)
      .json({ message: "Failed to update bulk data", error: error.message });
  }
};

const bulkUpdateEmployeeAttendance = async (req, res) => {
  const {
    selectedYear,
    selectedMonth,
    updateBulkData,
    isAttandance,
    isSalary,
    isIncentivandBonus,
    isArrer,
    isDeduction,
    isReimbursment,
    isAdvance,
    isPayslip,
    isPayslipSent,
    isAttandanceChecked,
    isSalaryChecked,
    isIncentivandBonusChecked,
    isArrerChecked,
    isDeductionChecked,
    isReimbursmentChecked,
    isAdvanceChecked,
    isPayslipChecked,
    isPayslipSentChecked,
    updates,
  } = req.body;

  try {
    const previousMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
    const previousYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;

    // Fetch previous month's payroll records to get `advanceBalance`
    const previousRecords = await PayrollRecords.find({
      "years.year": previousYear,
      "years.months.month": previousMonth,
    });

    const previousAdvances = {};
    previousRecords.forEach((record) => {
      record.years.forEach((y) => {
        if (y.year === previousYear) {
          y.months.forEach((m) => {
            if (m.month === previousMonth) {
              m.EmployeeAttandanceData.forEach((employee) => {
                previousAdvances[employee.employeeObjID] =
                  employee.advanceBalance || 0;
              });
            }
          });
        }
      });
    });

    const updatePromises = updates.map(async (update) => {
      // Set PreviousAdvance based on last month's balance

      // Perform calculations before updating
      update.totalBNIAdditions =
        (update.bonusAmount || 0) + (update.insentiveAmount || 0);

      update.salaryaAfterBonusAndInsentive =
        (update.actualTotalSalary || 0) + update.totalBNIAdditions;

      update.SalaryAfterArrearAmt =
        update.salaryaAfterBonusAndInsentive +
        (update.ArrearAmountPay || 0) -
        (update.ArrearAmountDeduct || 0);

      update.totalDeductionsAmount =
        (update.PFDeduction || 0) +
        (update.ESIDedeuction || 0) +
        (update.TDSDeduction || 0) +
        (update.OtherDeductions || 0);

      update.PreviousAdvance = previousAdvances[update.employeeObjID] || 0;

      update.advanceBalance =
        update.PreviousAdvance +
        (update.advanceAmountPay || 0) -
        (update.advanceAmountDeduct || 0);

      update.salaryAfterAdvance =
        update.SalaryAfterArrearAmt +
        (update.advanceAmountPay || 0) -
        (update.advanceAmountDeduct || 0);

      update.finalSalary =
        update.salaryAfterAdvance - (update.LoanDeduction || 0);

      update.salaryAfterPFESIandTDS =
        update.salaryAfterAdvance - update.totalDeductionsAmount;

      update.salaryAfterReimbursment =
        update.salaryAfterPFESIandTDS + (update.reimbursmentApproved || 0);

      const filter = {
        "years.year": selectedYear,
        "years.months.month": selectedMonth,
        "years.months.EmployeeAttandanceData.employeeObjID":
          update.employeeObjID,
      };

      const updateQuery = {
        $set: {
          "years.$[yearElem].months.$[monthElem].isAttandance": isAttandance,
          "years.$[yearElem].months.$[monthElem].isSalary": isSalary,
          "years.$[yearElem].months.$[monthElem].isIncentivandBonus":
            isIncentivandBonus,
          "years.$[yearElem].months.$[monthElem].isArrer": isArrer,
          "years.$[yearElem].months.$[monthElem].isAttanisDeductiondance":
            isDeduction,
          "years.$[yearElem].months.$[monthElem].isReimbursment":
            isReimbursment,
          "years.$[yearElem].months.$[monthElem].isAdvance": isAdvance,
          "years.$[yearElem].months.$[monthElem].isPayslip": isPayslip,
          "years.$[yearElem].months.$[monthElem].isPayslipSent": isPayslipSent,
          "years.$[yearElem].months.$[monthElem].isAttandanceChecked":
            isAttandanceChecked,
          "years.$[yearElem].months.$[monthElem].isSalaryChecked":
            isSalaryChecked,
          "years.$[yearElem].months.$[monthElem].isIncentivandBonusChecked":
            isIncentivandBonusChecked,
          "years.$[yearElem].months.$[monthElem].isArrerChecked":
            isArrerChecked,
          "years.$[yearElem].months.$[monthElem].isDeductionChecked":
            isDeductionChecked,
          "years.$[yearElem].months.$[monthElem].isReimbursmentChecked":
            isReimbursmentChecked,
          "years.$[yearElem].months.$[monthElem].isAdvanceChecked":
            isAdvanceChecked,
          "years.$[yearElem].months.$[monthElem].isPayslipChecked":
            isPayslipChecked,
          "years.$[yearElem].months.$[monthElem].isPayslipSentChecked":
            isPayslipSentChecked,
          ...Object.fromEntries(
            Object.entries(update).map(([key, value]) => [
              `years.$[yearElem].months.$[monthElem].EmployeeAttandanceData.$[employeeElem].${key}`,
              value,
            ])
          ),
        },
      };

      const options = {
        arrayFilters: [
          { "yearElem.year": selectedYear },
          { "monthElem.month": selectedMonth },
          { "employeeElem.employeeObjID": update.employeeObjID },
        ],
        new: true, // Return the updated document
      };

      // Perform the update for each employee
      return PayrollRecords.findOneAndUpdate(filter, updateQuery, options);
    });

    // Wait for all updates to complete
    const results = await Promise.all(updatePromises);

    res.status(200).json({
      message: "Bulk update successful",
      results,
    });
  } catch (error) {
    console.error("Error during bulk update:", error);
    res.status(500).json({
      message: "Bulk update failed",
      error: error.message,
    });
  }
};

// Controller to update SalaryStatus
const updateSalaryStatus = async (req, res) => {
  try {
    const { year, month, status } = req.body;

    if (!year || !month || !status) {
      return res
        .status(400)
        .json({ message: "Year, month, and status are required." });
    }

    // Validate status
    const validStatuses = ["created", "inprogress", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid SalaryStatus value." });
    }

    const payrollRecord = await PayrollRecords.findOneAndUpdate(
      { "years.year": year, "years.months.month": month },
      { $set: { "years.$[].months.$[monthElem].SalaryStatus": status } },
      { arrayFilters: [{ "monthElem.month": month }], new: true }
    );

    if (!payrollRecord) {
      return res.status(404).json({ message: "Payroll record not found." });
    }

    res
      .status(200)
      .json({ message: "SalaryStatus updated successfully", payrollRecord });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllPayrollData = async (req, res) => {
  try {
    const { employeeId } = req.params; // Get employee ID from request parameters
    const payrollData = await PayrollRecords.find({
      "years.months.EmployeeAttandanceData.employeeObjID": employeeId,
    });
    if (!payrollData || payrollData.length === 0) {
      return res
        .status(404)
        .json({ message: "No payroll records found for this employee" });
    }

    const formattedData = {};

    payrollData.forEach((record) => {
      record.years.forEach((yearData) => {
        const year = yearData.year;
        if (!formattedData[year]) {
          formattedData[year] = [];
        }

        yearData.months.forEach((monthData) => {
          const monthNames = [
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
          const monthName = monthNames[monthData.month - 1];
          const isPayslipSentChecked = monthData.isPayslipSentChecked;

          monthData.EmployeeAttandanceData.forEach((employee) => {
            if (employee.employeeObjID.toString() === employeeId) {
              formattedData[year].push({
                month: monthName,
                employeeId: employee.employeeObjID?._id || "N/A",
                employeeName: employee.employeeObjID?.name || "Unknown",
                isAttChecked: employee.isAttChecked,
                isPayslipSentChecked: isPayslipSentChecked || false,
                status: employee.status,
                daysInMonth: employee.daysInMonth,
                absent: employee.absent,
                present: employee.present,
                halfday: employee.halfday,
                holiday: employee.holiday,
                paidLeaves: employee.paidLeaves,
                unpaidLeaves: employee.unpaidLeaves,
                NCNS: employee.NCNS,
                Sandwhich: employee.Sandwhich,
                totalPayableDays: employee.totalPayableDays,
                isSalaryPrepared: employee.isSalaryPrepared,
                fixedBasic: employee.fixedBasic,
                fixedHRA: employee.fixedHRA,
                fixedConvenyance: employee.fixedConvenyance,
                fixedOthers: employee.fixedOthers,
                fixedTotalSalary: employee.fixedTotalSalary,
                actualBasic: employee.actualBasic,
                actualHRA: employee.actualHRA,
                actualConvenyance: employee.actualConvenyance,
                actualOthers: employee.actualOthers,
                actualTotalSalary: employee.actualTotalSalary,
                bonusAmount: employee.bonusAmount,
                bonusType: employee.bonusType,
                insentiveAmount: employee.insentiveAmount,
                insentiveType: employee.insentiveType,
                totalBNIAdditions: employee.totalBNIAdditions,
                additionComment: employee.additionComment,
                salaryAfterBonusAndIncentive:
                  employee.salaryaAfterBonusAndInsentive,
                ArrearMonth: employee.ArrearMonth,
                ArrearAmountPay: employee.ArrearAmountPay,
                ArrearAmountDeduct: employee.ArrearAmountDeduct,
                SalaryAfterArrearAmt: employee.SalaryAfterArrearAmt,
                arrearMessage: employee.arrearMessage,
                PFDeduction: employee.PFDeduction,
                ESIDedeuction: employee.ESIDedeuction,
                TDSDeduction: employee.TDSDeduction,
                totalDeductionsAmount: employee.totalDeductionsAmount,
                SalaryAfterDeduction: employee.SalaryAfterDeduction,
                deductionNotes: employee.deductionNotes,
                salaryAfterPFESIandTDS: employee.salaryAfterPFESIandTDS,
                reimbursmentApplied: employee.reimbursmentApplied,
                reimbursmentApproved: employee.reimbursmentApproved,
                reimbursmentNotes: employee.reimbursmentNotes,
                salaryAfterReimbursment: employee.salaryAfterReimbursment,
                advanceDuration: employee.advanceDuration,
                PreviousAdvance: employee.PreviousAdvance,
                advanceAmountPay: employee.advanceAmountPay,
                advanceAmountDeduct: employee.advanceAmountDeduct,
                advanceBalance: employee.advanceBalance,
                salaryAfterAdvance: employee.salaryAfterAdvance,
                ReasonForAdvance: employee.ReasionForAdvance,
                createdAt: employee.createdAt,
                updatedAt: employee.updatedAt,
                FullName: employee.FullName,
                departmentName: employee.departmentName,
                designationName: employee.designationName,
                empID: employee.empID,
                doj: employee.doj,
                workLocation: employee.workLocation,
                PanNumber: employee.PanNumber,
                UanNumber: employee.UanNumber,
                BankAccount: employee.BankAccount,
                BankIFSC: employee.BankIFSC,
                BankName: employee.BankName,
              });
            }
          });
        });
      });
    });

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getAllPayrollDataAllEmp = async (req, res) => {
  try {
    const payrollData = await PayrollRecords.find({}); // Fetch all payroll records

    if (!payrollData || payrollData.length === 0) {
      return res.status(404).json({ message: "No payroll records found" });
    }

    const formattedData = {};

    payrollData.forEach((record) => {
      record.years.forEach((yearData) => {
        const year = yearData.year;
        if (!formattedData[year]) {
          formattedData[year] = [];
        }

        yearData.months.forEach((monthData) => {
          const monthNames = [
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
          const monthName = monthNames[monthData.month - 1];
          const isPayslipSentChecked = monthData.isPayslipSentChecked || false;

          monthData.EmployeeAttandanceData.forEach((employee) => {
            const employeeId = employee.employeeObjID?._id || "N/A";

            formattedData[year].push({
              month: monthName,
              employeeId,
              FullName: employee.FullName,
              empID: employee.empID,
              doj: employee.doj,
              workLocation: employee.workLocation,
              PanNumber: employee.PanNumber,
              UanNumber: employee.UanNumber,
              BankName: employee.BankName,
              BankAccount: employee.BankAccount,
              BankIFSC: employee.BankIFSC,
              departmentName: employee.departmentName,
              designationName: employee.designationName,
              isAttChecked: employee.isAttChecked,
              isPayslipSentChecked,
              status: employee.status,
              daysInMonth: employee.daysInMonth,
              absent: employee.absent,
              present: employee.present,
              halfday: employee.halfday,
              holiday: employee.holiday,
              paidLeaves: employee.paidLeaves,
              unpaidLeaves: employee.unpaidLeaves,
              NCNS: employee.NCNS,
              Sandwhich: employee.Sandwhich,
              totalPayableDays: employee.totalPayableDays,
              isSalaryPrepared: employee.isSalaryPrepared,
              fixedBasic: employee.fixedBasic,
              fixedHRA: employee.fixedHRA,
              fixedConvenyance: employee.fixedConvenyance,
              fixedOthers: employee.fixedOthers,
              fixedTotalSalary: employee.fixedTotalSalary,
              actualBasic: employee.actualBasic,
              actualHRA: employee.actualHRA,
              actualConvenyance: employee.actualConvenyance,
              actualOthers: employee.actualOthers,
              actualTotalSalary: employee.actualTotalSalary,
              bonusAmount: employee.bonusAmount,
              bonusType: employee.bonusType,
              insentiveAmount: employee.insentiveAmount,
              insentiveType: employee.insentiveType,
              totalBNIAdditions: employee.totalBNIAdditions,
              additionComment: employee.additionComment,
              salaryAfterBonusAndIncentive:
                employee.salaryaAfterBonusAndInsentive,
              ArrearMonth: employee.ArrearMonth,
              ArrearAmountPay: employee.ArrearAmountPay,
              ArrearAmountDeduct: employee.ArrearAmountDeduct,
              SalaryAfterArrearAmt: employee.SalaryAfterArrearAmt,
              arrearMessage: employee.arrearMessage,
              PFDeduction: employee.PFDeduction,
              ESIDedeuction: employee.ESIDedeuction,
              TDSDeduction: employee.TDSDeduction,
              totalDeductionsAmount: employee.totalDeductionsAmount,
              SalaryAfterDeduction: employee.SalaryAfterDeduction,
              deductionNotes: employee.deductionNotes,
              salaryAfterPFESIandTDS: employee.salaryAfterPFESIandTDS,
              reimbursmentApplied: employee.reimbursmentApplied,
              reimbursmentApproved: employee.reimbursmentApproved,
              reimbursmentNotes: employee.reimbursmentNotes,
              salaryAfterReimbursment: employee.salaryAfterReimbursment,
              advanceDuration: employee.advanceDuration,
              PreviousAdvance: employee.PreviousAdvance,
              advanceAmountPay: employee.advanceAmountPay,
              advanceAmountDeduct: employee.advanceAmountDeduct,
              advanceBalance: employee.advanceBalance,
              salaryAfterAdvance: employee.salaryAfterAdvance,
              ReasonForAdvance: employee.ReasionForAdvance,
              createdAt: employee.createdAt,
              updatedAt: employee.updatedAt,
              FullName: employee.FullName,
              departmentName: employee.departmentName,
              designationName: employee.designationName,
              empID: employee.empID,
              doj: employee.doj,
              workLocation: employee.workLocation,
              PanNumber: employee.PanNumber,
              UanNumber: employee.UanNumber,
              BankAccount: employee.BankAccount,
              BankIFSC: employee.BankIFSC,
              BankName: employee.BankName,
            });
          });
        });
      });
    });

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  addPayrollRecord,
  addPayrollRecordsMany,
  getAllPayrollRecords,
  getPayrollRecordsByYear,
  getPayrollRecordsByMonth,
  getPayrollRecordsByEmployee,
  updateAttendanceChecked,
  updatePayrollRecordsMany,
  getPayrollRecords,
  updateBulkEmployeeAttendanceData,
  bulkUpdateEmployeeAttendance,
  updateSalaryStatus,
  getAllPayrollData,
  getAllPayrollDataAllEmp,
};
