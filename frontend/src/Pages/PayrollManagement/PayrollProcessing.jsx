import React, { useEffect, useState } from "react";
import TittleHeader from "../TittleHeader/TittleHeader";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { LuCalendar, LuCheck } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { rowBodyStyle, rowHeadStyle } from "../../Style/TableStyle";
import ProfileAvatar from "../../Utils/ProfileAvatar/ProfileAvatar";
import PayrollSkyImage from "./PayrollSkyImage.png";
import { formatIndianCurrency } from "../../Utils/CurrencySymbol/formatIndianCurrency";
import axios from "axios";
import BASE_URL from "../config/config";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import SalaryPlaceHolder from "../../img/Salary.png";
import Styles from "../../Style/Scroller.module.css";
import { useSelector } from "react-redux";
import api from "../config/api";

const PayrollProcessing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const [refetch, setRefetch] = useState(false);
  // Extract year and month from URL or fallback to current date
  const currentYearData = new Date().getFullYear();
  const currentMonthData = new Date().getMonth() + 1;
  const Paramsyear = searchParams.get("year") || currentYearData;
  const Paramsmonth = searchParams.get("month") || currentMonthData;
  const { userData } = useSelector((state) => state.user);
  const userType = userData?.Account;

  const [selectedYear, setSelectedYear] = useState(parseInt(Paramsyear, 10));
  const [selectedMonth, setSelectedMonth] = useState(parseInt(Paramsmonth, 10));
  const [updates, setUpdates] = useState([]);

  const { darkMode } = useTheme();

  // Function to update URL parameters when year or month changes
  const updateURLParams = (year, month) => {
    searchParams.set("year", year);
    searchParams.set("month", month);
    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  const [isAttandance, setIsAttandance] = useState(true);
  const [isSalary, setIsSalary] = useState(false);
  const [isIncentivandBonus, setIsIncentivandBonus] = useState(false);
  const [isArrer, setIsArrer] = useState(false);
  const [isDeduction, setIsDeduction] = useState(false);
  const [isReimbursment, setIsReimbursment] = useState(false);
  const [isAdvance, setIsAdvance] = useState(false);
  const [isPayslip, setIsPayslip] = useState(false);
  const [isPayslipSent, setIsPayslipSent] = useState(false);
  const [isAttandanceChecked, setIsAttandanceChecked] = useState(false);
  const [isSalaryChecked, setIsSalaryChecked] = useState(false);
  const [isIncentivandBonusChecked, setIsIncentivandBonusChecked] =
    useState(false);
  const [isArrerChecked, setIsArrerChecked] = useState(false);
  const [isDeductionChecked, setIsDeductionChecked] = useState(false);
  const [isReimbursmentChecked, setIsReimbursmentChecked] = useState(false);
  const [isAdvanceChecked, setIsAdvanceChecked] = useState(false);
  const [isPayslipChecked, setIsPayslipChecked] = useState(false);
  const [isPayslipSentChecked, setIsPayslipSentChecked] = useState(false);

  const [payrollRecordsData, setPayrollRecordsData] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [salaryLoading, setSalaryLoading] = useState(false);
  const [bonusLoading, setBonusLoading] = useState(false);
  const [arrearsLoading, setArrearsLoading] = useState(false);
  const [deductionsLoading, setDeductionsLoading] = useState(false);
  const [reimbursmentLoading, setReimbursmentLoading] = useState(false);
  const [advanceLoading, setAdvanceLoading] = useState(false);

  const PayrollData = [
    {
      id: 1,
      isChecked: isAttandanceChecked,
      pageName: "Attendance Overview",
      message: "View attendance details",
      isPageActive: isAttandance,
    },
    {
      id: 2,
      isChecked: isSalaryChecked,
      pageName: "Salary Overview",
      message: "View attandance details",
      isPageActive: isSalary,
    },
    {
      id: 3,
      isChecked: isIncentivandBonusChecked,
      pageName: "Bonus and Incentive",
      message: "View bonus and incentives",
      isPageActive: isIncentivandBonus,
    },
    {
      id: 4,
      isChecked: isArrerChecked,
      pageName: "Arrears in Salary",
      message: "Add arrears details",
      isPageActive: isArrer,
    },
    {
      id: 5,
      isChecked: isAdvanceChecked,
      pageName: "Advances Salary",
      message: "Employee Advance details",
      isPageActive: isAdvance,
    },
    {
      id: 6,
      isChecked: isDeductionChecked,
      pageName: "Deductions Overview",
      message: "View PF, ESI and TDS deductions",
      isPageActive: isDeduction,
    },
    {
      id: 7,
      isChecked: isReimbursmentChecked,
      pageName: "Reimbursment Overview",
      message: "View Employee's Reimbursment",
      isPageActive: isReimbursment,
    },

    {
      id: 8,
      isChecked: isPayslipChecked,
      pageName: "Salary Summary",
      message: "View Final Salary Summary",
      isPageActive: isPayslip,
    },
    {
      id: 9,
      isChecked: isPayslipSentChecked,
      pageName: "Payslip",
      message: "Payslip Processed Successfully",
      isPageActive: isPayslipSent,
    },
  ];

  const fetchPayrollData = async () => {
    try {
      const response = await api.get(`/api/payroll` , {
        });
      setPayrollRecordsData(response.data);
    } catch (error) {
      console.error("Error fetching payroll data:", error);
    }
  };

  useEffect(() => {
    fetchPayrollData();
  }, []);

  const monthlyPayrollData = payrollRecordsData
    .filter((data) => data.years.some((year) => year.year === selectedYear))
    .flatMap((data) =>
      data.years
        .filter((year) => year.year === selectedYear)
        .flatMap((year) =>
          year.months
            .filter((month) => month.month === selectedMonth)
            .flatMap((month) => month.EmployeeAttandanceData)
        )
    );

  const handleClick = (id) => {
    setIsAttandance(id === 1);
    setIsSalary(id === 2);
    setIsIncentivandBonus(id === 3);
    setIsArrer(id === 4);
    setIsAdvance(id === 5);
    setIsDeduction(id === 6);
    setIsReimbursment(id === 7);
    setIsPayslip(id === 8);
    setIsPayslipSent(id === 9);
  };

  useEffect(() => {
    const fetchEmployeeAttendanceData = async () => {
      try {
        const response = await api.get(`/api/payroll` , {
        });
        const payrollRecords = response.data;
        console.log(payrollRecords);

        // Get previous month and year
        const prevDate = new Date(selectedYear, selectedMonth - 1, 1);
        const prevYear = prevDate.getFullYear();

        // Filter payroll records for the selected year and month
        const filteredRecords = payrollRecords
          .filter((record) => record.years.some((y) => y.year === selectedYear))
          .flatMap((record) =>
            record.years
              .filter((y) => y.year === selectedYear)
              .flatMap((y) =>
                y.months
                  .filter((m) => m.month === selectedMonth)
                  .flatMap((m) => m.EmployeeAttandanceData)
              )
          );

        const yearData = payrollRecords[0]?.years.find(
          (y) => y.year === selectedYear
        );
        const monthData = yearData?.months.find(
          (m) => m.month === selectedMonth
        );

        // setIsAttandance(monthData?.isAttandance || false);
        // setIsSalary(monthData?.isSalary || false);
        // setIsIncentivandBonus(monthData?.isIncentivandBonus || false);
        // setIsArrer(monthData?.isArrer || false);
        // setIsAdvance(monthData?.isAdvance || false);
        // setIsDeduction(monthData?.isDeduction || false);
        // setIsPayslip(monthData?.isPayslip || false);
        // setIsPayslipSent(monthData?.isPayslipSent || false);
        setIsAttandanceChecked(monthData?.isAttandanceChecked || false);
        setIsSalaryChecked(monthData?.isSalaryChecked || false);
        setIsIncentivandBonusChecked(
          monthData?.isIncentivandBonusChecked || false
        );
        setIsArrerChecked(monthData?.isArrerChecked || false);
        setIsDeductionChecked(monthData?.isDeductionChecked || false);
        setIsReimbursmentChecked(monthData?.isReimbursmentChecked || false);
        setIsAdvanceChecked(monthData?.isAdvanceChecked || false);
        setIsPayslipChecked(monthData?.isPayslipChecked || false);
        setIsPayslipSentChecked(monthData?.isPayslipSentChecked || false);

        // Get previous month and adjusted year
        const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
        const adjustedPrevYear =
          selectedMonth === 1 ? selectedYear - 1 : selectedYear;

        // Filter previous month's payroll records only
        const prevRecords = payrollRecords
          .filter((record) =>
            record.years.some((y) => y.year === adjustedPrevYear)
          )
          .flatMap((record) =>
            record.years
              .filter((y) => y.year === adjustedPrevYear)
              .flatMap((y) =>
                y.months
                  .filter((m) => m.month === prevMonth) // ✅ Only one month back
                  .flatMap((m) => m.EmployeeAttandanceData)
              )
          );

        // Create advance map using only latest (last month) data
        const previousAdvanceMap = new Map();

        prevRecords.forEach((prevEmp) => {
          const empID = prevEmp?.employeeObjID?._id || prevEmp?._id;
          if (!previousAdvanceMap.has(empID)) {
            previousAdvanceMap.set(empID, prevEmp?.advanceBalance || 0);
          }
        });

        // Initialize updates with employee attendance data
        const initialUpdates = filteredRecords.map((employee) => {
          const empID = employee?.employeeObjID?._id || employee?._id;
          return {
            employeeObjID: empID,
            FullName:
              employee?.employeeObjID?.FirstName +
                " " +
                employee?.employeeObjID?.LastName || "",

            isFullandFinal: employee?.employeeObjID?.isFullandFinal || "",

            BasicSalary:
              employee?.employeeObjID?.salary[
                employee?.employeeObjID?.salary.length - 1
              ]?.BasicSalary || 0,
            BasicHRA:
              employee?.employeeObjID?.salary[
                employee?.employeeObjID?.salary.length - 1
              ]?.HRASalary || 0,
            BasicConvenyance:
              employee?.employeeObjID?.salary[
                employee?.employeeObjID?.salary.length - 1
              ]?.ConvenyanceAllowance || 0,
            BasicOthers:
              employee?.employeeObjID?.salary[
                employee?.employeeObjID?.salary.length - 1
              ]?.ConvenyanceAllowance || 0,
            FixedMonthlySalary:
              employee?.employeeObjID?.salary[
                employee?.employeeObjID?.salary.length - 1
              ]?.totalSalary || 0,
            empID: employee?.employeeObjID?.empID || "",
            isAttChecked: employee?.isAttChecked || false,
            status: employee?.status || "Proceed",
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
            SalaryAfterDeduction: employee?.SalaryAfterDeduction || 0,
            deductionNotes: employee?.deductionNotes || "",
            salaryAfterPFESIandTDS: employee?.salaryAfterPFESIandTDS || 0,
            reimbursmentApplied: employee?.reimbursmentApplied || 0,
            reimbursmentApproved: employee?.reimbursmentApproved || 0,
            reimbursmentNotes: employee?.reimbursmentNotes || "",
            salaryAfterReimbursment: employee?.salaryAfterReimbursment || 0,
            advanceDuration: employee?.advanceDuration || 0,
            PreviousAdvance: previousAdvanceMap.get(empID) || 0,
            advanceAmountPay: employee?.advanceAmountPay || 0,
            advanceAmountDeduct: employee?.advanceAmountDeduct || 0,
            advanceBalance: employee?.advanceBalance || 0,
            salaryAfterAdvance: employee?.salaryAfterAdvance || 0,
            ReasionForAdvance: employee?.ReasionForAdvance || "",
          };
        });

        setUpdates(initialUpdates);
      } catch (error) {
        console.error("Error fetching employee attendance data:", error);
      }
    };

    fetchEmployeeAttendanceData();
  }, [selectedYear, selectedMonth, refetch]);

  const handleChange = (index, field, value) => {
    const newUpdates = [...updates];
    newUpdates[index][field] = value;
    setUpdates(newUpdates);
  };

  const handleSubmitAttendance = async (e) => {
    e.preventDefault();

    const updatesWithID = updates.map((update, index) => ({
      ...update,
      employeeObjID: update.employeeObjID,
    }));

    setAttendanceLoading(true);

    try {
      await api.post(`/api/payroll/updateBulkData`, {
        selectedYear,
        selectedMonth,
        isAttandance: false,
        isSalary: true,
        isIncentivandBonus: false,
        isArrer: false,
        isDeduction: false,
        isReimbursment: false,
        isAdvance: false,
        isPayslip: false,
        isPayslipSent: false,
        isAttandanceChecked: true,
        isSalaryChecked: isSalaryChecked,
        isIncentivandBonusChecked: isIncentivandBonusChecked,
        isArrerChecked: isArrerChecked,
        isDeductionChecked: isDeductionChecked,
        isReimbursmentChecked: isReimbursmentChecked,
        isAdvanceChecked: isAdvanceChecked,
        isPayslipChecked: isPayslipChecked,
        isPayslipSentChecked: isPayslipSentChecked,
        updates: updatesWithID,
      }
        );
      toast.success("Salary updated successfully!");
      setAttendanceLoading(false);
      setIsAttandanceChecked(true);
      setIsSalary(true);
      setIsAttandance(false);
      setRefetch((prev) => !prev);
    } catch (error) {
      console.error("Error during Salary update:", error);
      toast.error("Salary update failed. Please try again.");
      setAttendanceLoading(false);
    }
  };

  const handleSubmitSalary = async (e) => {
    e.preventDefault();

    const updatesWithID = updates.map((update) => ({
      ...update,
      employeeObjID: update.employeeObjID,
    }));

    setSalaryLoading(true);

    try {
      await api.post(`/api/payroll/updateBulkData`, {
        selectedYear,
        selectedMonth,
        isAttandance: false,
        isSalary: false,
        isIncentivandBonus: true,
        isArrer: false,
        isDeduction: false,
        isReimbursment: false,
        isAdvance: false,
        isPayslip: false,
        isPayslipSent: false,
        isAttandanceChecked: isAttandanceChecked,
        isSalaryChecked: true,
        isIncentivandBonusChecked: isIncentivandBonusChecked,
        isArrerChecked: isArrerChecked,
        isDeductionChecked: isDeductionChecked,
        isReimbursmentChecked: isReimbursmentChecked,
        isAdvanceChecked: isAdvanceChecked,
        isPayslipChecked: isPayslipChecked,
        isPayslipSentChecked: isPayslipSentChecked,
        updates: updatesWithID,
      }, 
        );

      toast.success("Salary updated successfully!");
      setSalaryLoading(false);
      setIsSalaryChecked(true);
      setIsIncentivandBonus(true);
      setIsSalary(false);
      setRefetch((prev) => !prev);
    } catch (error) {
      console.error("Error during Salary update:", error);
      toast.error("Salary update failed. Please try again.");
      setSalaryLoading(false);
    }
  };

  const handleSubmitBonusandInsentive = async (e) => {
    e.preventDefault();

    const updatesWithID = updates.map((update, index) => ({
      ...update,
      employeeObjID: update.employeeObjID,
    }));
    setBonusLoading(true);

    try {
      await api.post(`/api/payroll/updateBulkData`, {
        selectedYear,
        selectedMonth,
        isAttandance: false,
        isSalary: false,
        isIncentivandBonus: false,
        isArrer: true,
        isDeduction: false,
        isReimbursment: false,
        isAdvance: false,
        isPayslip: false,
        isPayslipSent: false,
        isAttandanceChecked: isAttandanceChecked,
        isSalaryChecked: isSalaryChecked,
        isIncentivandBonusChecked: true,
        isArrerChecked: isArrerChecked,
        isDeductionChecked: isDeductionChecked,
        isReimbursmentChecked: isReimbursmentChecked,
        isAdvanceChecked: isAdvanceChecked,
        isPayslipChecked: isPayslipChecked,
        isPayslipSentChecked: isPayslipSentChecked,
        updates: updatesWithID,
      }, );
      toast.success("Bonus & Incentive updated successfully!");
      setBonusLoading(false);
      setIsIncentivandBonusChecked(true);
      setIsIncentivandBonus(false);
      setIsArrer(true);
      setRefetch((prev) => !prev);
    } catch (error) {
      console.error("Error during Bonus & Incentive update:", error);
      toast.error("Bonus & Incentive update failed. Please try again.");
      setBonusLoading(false);
    }
  };

  const handleSubmitArrears = async (e) => {
    e.preventDefault();

    const updatesWithID = updates.map((update, index) => ({
      ...update,
      employeeObjID: update.employeeObjID,
    }));

    setArrearsLoading(true);
    try {
      await api.post(`/api/payroll/updateBulkData`, {
        selectedYear,
        selectedMonth,
        isAttandance: false,
        isSalary: false,
        isIncentivandBonus: false,
        isArrer: false,
        isAdvance: true,
        isDeduction: false,
        isReimbursment: false,
        isPayslip: false,
        isPayslipSent: false,
        isAttandanceChecked: isAttandanceChecked,
        isSalaryChecked: isSalaryChecked,
        isIncentivandBonusChecked: isIncentivandBonusChecked,
        isArrerChecked: true,
        isDeductionChecked: isDeductionChecked,
        isReimbursmentChecked: isReimbursmentChecked,
        isAdvanceChecked: isAdvanceChecked,
        isPayslipChecked: isPayslipChecked,
        isPayslipSentChecked: isPayslipSentChecked,
        updates: updatesWithID,
      }, );
      toast.success("Arrears updated successfully!");
      setArrearsLoading(false);

      setIsArrerChecked(true);
      setIsArrer(false);
      setIsAdvance(true);
      setRefetch((prev) => !prev);
    } catch (error) {
      console.error("Error during Arrears update:", error);
      toast.error("Arrears update failed. Please try again.");
      setArrearsLoading(false);
    }
  };

  const handleSubmitAdvance = async (e) => {
    e.preventDefault();

    const updatesWithID = updates.map((update) => ({
      ...update,
      employeeObjID: update.employeeObjID,
    }));

    setAdvanceLoading(true);
    try {
      await api.post(`/api/payroll/updateBulkData`, {
        selectedYear,
        selectedMonth,
        isAttandance: false,
        isSalary: false,
        isIncentivandBonus: false,
        isArrer: false,
        isAdvance: false,
        isDeduction: true,
        isReimbursment: false,
        isPayslip: false,
        isPayslipSent: false,
        isAttandanceChecked: isAttandanceChecked,
        isSalaryChecked: isSalaryChecked,
        isIncentivandBonusChecked: isIncentivandBonusChecked,
        isArrerChecked: isArrerChecked, // Fixed the incorrect variable
        isDeductionChecked: isDeductionChecked,
        isReimbursmentChecked: isReimbursmentChecked, // Fixed incorrect mapping
        isAdvanceChecked: true,
        isPayslipChecked: isPayslipChecked,
        isPayslipSentChecked: isPayslipSentChecked,
        updates: updatesWithID,
      },);

      toast.success("Advance updated successfully!");
      setAdvanceLoading(false);
      setIsAdvanceChecked(true);
      setIsAdvance(false);
      setIsDeduction(true);
      setRefetch((prev) => !prev);
    } catch (error) {
      console.error("Error during Advance update:", error);
      toast.error("Advance update failed. Please try again.");
      setAdvanceLoading(false);
    }
  };

  const handleSubmitDeductions = async (e) => {
    e.preventDefault();

    const updatesWithID = updates.map((update, index) => ({
      ...update,
      employeeObjID: update.employeeObjID,
    }));

    setDeductionsLoading(true);
    try {
      await api.post(`/api/payroll/updateBulkData`, {
        selectedYear,
        selectedMonth,
        isAttandance: false,
        isSalary: false,
        isIncentivandBonus: false,
        isArrer: false,
        isDeduction: false,
        isReimbursment: true,
        isAdvance: false,
        isPayslip: false,
        isPayslipSent: false,
        isAttandanceChecked: isAttandanceChecked,
        isSalaryChecked: isSalaryChecked,
        isIncentivandBonusChecked: isIncentivandBonusChecked,
        isArrerChecked: isIncentivandBonusChecked,
        isDeductionChecked: true,
        isReimbursmentChecked: isReimbursmentChecked,
        isAdvanceChecked: isAdvanceChecked,
        isPayslipChecked: isPayslipChecked,
        isPayslipSentChecked: isPayslipSentChecked,
        updates: updatesWithID,
      },);
      toast.success("Deductions updated successfully!");

      setDeductionsLoading(false);
      setIsDeductionChecked(true);
      setIsDeduction(false);
      setIsReimbursment(true);
      setRefetch((prev) => !prev);
    } catch (error) {
      console.error("Error during Deductions update:", error);
      toast.error("Deductions update failed. Please try again.");
      setDeductionsLoading(false);
    }
  };

  const handleSubmitReimbursment = async (e) => {
    e.preventDefault();

    const updatesWithID = updates.map((update, index) => ({
      ...update,
      employeeObjID: update.employeeObjID,
    }));
    setReimbursmentLoading(true);
    try {
      await api.post(`/api/payroll/updateBulkData`, {
        selectedYear,
        selectedMonth,
        isAttandance: false,
        isSalary: false,
        isIncentivandBonus: false,
        isArrer: false,
        isDeduction: false,
        isReimbursment: false,
        isAdvance: false,
        isPayslip: true,
        isPayslipSent: false,
        isAttandanceChecked: isAttandanceChecked,
        isSalaryChecked: isSalaryChecked,
        isIncentivandBonusChecked: isIncentivandBonusChecked,
        isArrerChecked: isIncentivandBonusChecked,
        isDeductionChecked: isDeductionChecked,
        isReimbursmentChecked: true,
        isAdvanceChecked: isAdvanceChecked,
        isPayslipChecked: isPayslipChecked,
        isPayslipSentChecked: isPayslipSentChecked,
        updates: updatesWithID,
      },);
      toast.success("Reimbursment updated successfully!");
      setReimbursmentLoading(false);
      setIsReimbursmentChecked(true);
      setIsReimbursment(false);
      setIsPayslip(true);
      setRefetch((prev) => !prev);
    } catch (error) {
      console.error("Error during Reimbursment update:", error);
      toast.error("Reimbursment update failed. Please try again.");
      setReimbursmentLoading(false);
    }
  };

  const handleSubmitSalarySummary = async (e) => {
    e.preventDefault();

    const updatesWithID = updates.map((update, index) => ({
      ...update,
      employeeObjID: update.employeeObjID,
    }));

    try {
      await api.post(`/api/payroll/updateBulkData`, {
        selectedYear,
        selectedMonth,
        isAttandance: false,
        isSalary: false,
        isIncentivandBonus: false,
        isArrer: false,
        isDeduction: false,
        isReimbursment: false,
        isAdvance: false,
        isPayslip: false,
        isPayslipSent: true,
        isAttandanceChecked: isAttandanceChecked,
        isSalaryChecked: isSalaryChecked,
        isIncentivandBonusChecked: isIncentivandBonusChecked,
        isArrerChecked: isIncentivandBonusChecked,
        isDeductionChecked: isDeductionChecked,
        isReimbursmentChecked: isDeductionChecked,
        isAdvanceChecked: isAdvanceChecked,
        isPayslipChecked: true,
        isPayslipSentChecked: isPayslipSentChecked,
        updates: updatesWithID,
      },);
      toast.success("Advance updated successfully!");
      setIsPayslipChecked(true);
      setIsPayslip(false);
      setIsPayslipSent(true);
      setRefetch((prev) => !prev);
    } catch (error) {
      console.error("Error during Advance update:", error);
      toast.error("Advance update failed. Please try again.");
    }
  };

  const handleSubmitPayslipSummary = async (e) => {
    e.preventDefault();

    const updatesWithID = updates.map((update, index) => ({
      ...update,
      employeeObjID: update.employeeObjID,
    }));

    try {
      await api.post(`/api/payroll/updateBulkData`, {
        selectedYear,
        selectedMonth,
        isAttandance: false,
        isSalary: false,
        isIncentivandBonus: false,
        isArrer: false,
        isDeduction: false,
        isReimbursment: false,
        isAdvance: false,
        isPayslip: false,
        isPayslipSent: true,
        isAttandanceChecked: isAttandanceChecked,
        isSalaryChecked: isSalaryChecked,
        isIncentivandBonusChecked: isIncentivandBonusChecked,
        isArrerChecked: isIncentivandBonusChecked,
        isDeductionChecked: isDeductionChecked,
        isReimbursmentChecked: isDeductionChecked,
        isAdvanceChecked: isAdvanceChecked,
        isPayslipChecked: true,
        isPayslipSentChecked: true,
        updates: updatesWithID,
      },);
      toast.success("Advance updated successfully!");
      setIsPayslipSentChecked(true);
      setIsPayslip(false);
      setIsPayslipSent(true);
      setRefetch((prev) => !prev);
    } catch (error) {
      console.error("Error during Advance update:", error);
      toast.error("Advance update failed. Please try again.");
    }
  };

  const currentYear = new Date().getFullYear();

  const currentMonth = new Date().getMonth() + 1;

  // Handle year change
  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value, 10);
    setSelectedYear(newYear);
    updateURLParams(newYear, selectedMonth);
  };

  // Handle month change
  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value, 10);
    setSelectedMonth(newMonth);
    updateURLParams(selectedYear, newMonth);
  };

  return (
    <div
      style={{ height: "90vh", overflowY: "auto" }}
      className={`container-fluid  ${darkMode ? "text-black" : "text-light"}`}
    >
      <div className="d-flex justify-content-between">
        <TittleHeader
          title={"Payroll Processing"}
          message={"Review employee's salary here"}
        />
        <div className="d-flex align-items-center gap-2">
          <div className="d-flex align-items-center gap-2">
            <span
              className="d-flex align-items-center gap-2"
              style={{ whiteSpace: "pre" }}
            >
              <LuCalendar /> Pay Period
            </span>

            {/* Year Selector */}
            <select
              style={{ width: "fit-content" }}
              onChange={handleYearChange}
              className={`form-select ms-0 ms-md-auto rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              value={selectedYear}
            >
              {Array.from({ length: 10 }, (_, i) => {
                const year = currentYear - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>

            {/* Month Selector */}
            <select
              style={{ width: "fit-content" }}
              onChange={handleMonthChange}
              className={`form-select ms-0 ms-md-auto rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              value={selectedMonth}
            >
              {Array.from({ length: 12 }, (_, i) => {
                const monthValue = i + 1;
                const isDisabled =
                  selectedYear === currentYear && monthValue > currentMonth;

                return (
                  <option
                    key={monthValue}
                    value={monthValue}
                    disabled={isDisabled}
                  >
                    {new Date(2024, i, 1).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
      {monthlyPayrollData.length > 0 ? (
        <div
          style={{ position: "relative", maxHeight: "80vh" }}
          className="d-flex flex-column flex-md-row  gap-2 justify-content-between mt-2"
        >
          <div
            className="d-flex flex-column gap-2  rounded-2 "
            style={{
              height: "fit-content",
              width: "fit-content",
              whiteSpace: "pre",

              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--primaryDashMenuColor)",
              position: "sticky",
              top: "0",
            }}
          >
            <div className="my-0 p-3 ">
              <h6 className="m-0 d-flex align-items-center gap-2">
                <span>
                  {PayrollData.filter((data) => data.isChecked).length}/
                  {PayrollData.length}
                </span>
                <span className="d-none d-md-flex"> Completed</span>
              </h6>
            </div>
            <div className="d-flex flex-row  w-100 flex-md-column gap-3 gap-md-2">
              {PayrollData.map((Payroll, index) => (
                <div
                  key={Payroll.id}
                  onClick={
                    Payroll.isChecked
                      ? () => handleClick(Payroll.id)
                      : undefined
                  }
                  className="d-flex  align-items-center gap-3 "
                  style={{
                    borderTop: Payroll.isChecked
                      ? "5px solid #007aff"
                      : darkMode
                      ? "5px solid rgba(213, 215, 218, 1)"
                      : "5px solid rgba(75, 77, 78, 0.93)",
                    padding: ".25rem .625rem .625rem .625rem",
                    cursor: Payroll.isChecked && "pointer",
                    width: "100%",
                  }}
                >
                  {Payroll.isChecked ? (
                    <span
                      className="badge-success d-flex align-items-center justify-content-center"
                      style={{
                        height: "2rem",
                        width: "2rem",
                        borderRadius: "50%",
                        border: Payroll.isPageActive && "2px solid #07aaff",
                        overflow: "hidden",
                      }}
                    >
                      <LuCheck />
                    </span>
                  ) : Payroll.isPageActive ? (
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        height: "2rem",
                        width: "2rem",
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "2px solid #07aaff",
                        background: darkMode
                          ? "rgba(255, 255, 255, 0.76)"
                          : "rgba(54, 54, 54, 0.73)",
                      }}
                    >
                      {index + 1}
                    </div>
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        height: "2rem",
                        width: "2rem",
                        borderRadius: "50%",
                        overflow: "hidden",
                        background: darkMode
                          ? "rgba(206, 200, 200, 0.76)"
                          : "rgba(73, 72, 72, 0.73)",
                      }}
                    >
                      {index + 1}
                    </div>
                  )}
                  <div className="d-none d-md-flex flex-column">
                    <h6 className="my-0">{Payroll.pageName}</h6>
                    <p className="my-0">{Payroll.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="d-flex flex-column gap-3 flex-grow-1 p-2  rounded-2"
            style={{ width: "100%", overflow: "hidden" }}
          >
            {isAttandance && (
              <form
                onSubmit={handleSubmitAttendance}
                style={{
                  height: "fit-content",
                  maxHeight: "75vh",
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--primaryDashMenuColor)",
                  position: "relative",
                  overflow: "auto",
                }}
                className={`d-flex flex-column flex-grow-1 p-2  rounded-2 mb-2 rounded-2`}
              >
                <div className="d-flex flex-column w-100 gap-2">
                  <div
                    style={{ height: "fit-content" }}
                    className="d-flex align-items-start justify-content-between"
                  >
                    <div>
                      <h6 className="my-0">Attendance Overview</h6>
                      <p className="my-0">View attendance details</p>
                    </div>
                  </div>
                  <div
                    style={{
                      height: "60vh",
                      overflow: "auto",
                      position: "relative",
                      border: darkMode
                        ? "1px solid rgba(193,189,189)"
                        : "1px solid rgba(193,189,189)",
                    }}
                    className={`rounded-2 ${Styles.scroller}`}
                  >
                    <table className="table mt-0 mb-0 table-hover">
                      <thead>
                        <tr
                          style={{
                            position: "sticky",
                            top: "-2px",
                            zIndex: "5",
                          }}
                        >
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-0rem",
                            }}
                          >
                            S.No
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-0rem",
                              left: "0",
                              zIndex: "5",
                            }}
                          >
                            Employee
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-0rem",
                            }}
                            className="text-center"
                          >
                            Emp ID
                          </th>
                          <th
                            className="text-center"
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-0rem",
                              background: darkMode
                                ? "rgba(211, 229, 248, 1)"
                                : "rgba(48, 95, 104, 1)",
                            }}
                          >
                            Days in Month
                          </th>
                          <th
                            className="text-center"
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-0rem",
                            }}
                          >
                            Absent
                          </th>
                          <th
                            className="text-center"
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-0rem",
                            }}
                          >
                            Present
                          </th>
                          <th
                            className="text-center"
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-0rem",
                            }}
                          >
                            Halfday
                          </th>
                          <th
                            className="text-center"
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-0rem",
                            }}
                          >
                            Holiday
                          </th>
                          <th
                            className="text-center"
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-0rem",
                            }}
                          >
                            NCNS
                          </th>
                          <th
                            className="text-center"
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-0rem",
                            }}
                          >
                            Sandwhich
                          </th>
                          <th
                            className="text-center"
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-0rem",
                            }}
                          >
                            Paid Leave
                          </th>
                          <th
                            className="text-center"
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-0rem",
                            }}
                          >
                            Unpaid Leave
                          </th>
                          <th
                            className="text-center"
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-0rem",
                              background: darkMode
                                ? "rgba(211, 248, 217, 1)"
                                : "rgb(51, 97, 59)",
                            }}
                          >
                            Total Payable Days
                          </th>
                        </tr>
                      </thead>
                      {/* <hr className="m-0 py-1" style={{ opacity: "0" }} /> */}
                      <tbody>
                        {monthlyPayrollData.map((data, index) => (
                          <tr key={index}>
                            <td
                              style={{
                                ...rowBodyStyle(darkMode),
                                background: darkMode ? "#F5F5F5" : "#232424",
                              }}
                              className="text-center border-0"
                            >
                              {" "}
                              {(index + 1).toString().padStart(2, 0)}
                            </td>
                            <td
                              style={{
                                ...rowBodyStyle(darkMode),
                                position: "sticky",
                                left: "0",
                                zIndex: "4",
                                background: darkMode ? "#F5F5F5" : "#232424",
                              }}
                              className="border-0"
                            >
                              <ProfileAvatar
                                imageURL={
                                  data?.employeeObjID?.profile?.image_url
                                }
                                firstName={data?.employeeObjID?.FirstName}
                                lastName={data?.employeeObjID?.LastName}
                                // additional={data?.employeeObjID.empID}
                              />
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {data?.employeeObjID?.empID}
                            </td>
                            <td
                              className="text-center"
                              style={{
                                ...rowBodyStyle(darkMode),
                                background: darkMode
                                  ? "rgba(237, 244, 251, 1)"
                                  : "rgba(48, 95, 104, 0.48)",
                              }}
                            >
                              {data.daysInMonth}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {data.absent}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {data.present}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {data.halfday}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {data.holiday}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {data.NCNS}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {data.Sandwhich}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {data.paidLeaves}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {data.unpaidLeaves}
                            </td>
                            <td
                              className="text-center"
                              style={{
                                ...rowBodyStyle(darkMode),
                                background: darkMode
                                  ? "rgb(236, 252, 241)"
                                  : "rgba(64, 126, 86, 0.36)",
                                fontWeight: "500",
                              }}
                            >
                              {data.totalPayableDays}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <hr className="m-0 py-1" style={{ opacity: "0" }} />
                    </table>
                  </div>
                </div>
                <div
                  style={{
                    background: darkMode
                      ? "rgb(255, 255, 255)"
                      : "rgba(65, 64, 64, 0.42)",
                    color: darkMode
                      ? "var(--secondaryDashColorDark)"
                      : "var(--primaryDashMenuColor)",
                    width: "100%",
                    // position: "sticky",
                    // bottom: "0",
                  }}
                  className="p-2 d-flex flex-column gap-2 mt-2"
                >
                  <div
                    className={`d-flex align-items-center  p-2  rounded-2 border  justify-content-between ${
                      darkMode ? "bg-light text-dark" : "bg-dark text-light"
                    }`}
                  >
                    <div
                      style={{ fontWeight: "600" }}
                      className="d-flex align-items-center gap-3"
                    >
                      Total No. of Employee : {updates.length}
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="ms-auto btn btn-primary  d-flex align-items-center gap-2"
                        disabled={attendanceLoading} // Disable button while loading
                      >
                        {attendanceLoading ? (
                          <span>Loading...</span> // Show loading text or spinner
                        ) : (
                          <>
                            Save & Next
                            <MdKeyboardArrowRight className="fs-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
            {isSalary && (
              <form
                onSubmit={handleSubmitSalary}
                style={{
                  minHeight: "60vh",
                  maxHeight: "75vh",
                  width: "100%",
                  overflow: "auto",
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--primaryDashMenuColor)",
                  position: "relative",
                }}
                className="d-flex flex-column flex-grow-1 p-2  rounded-2"
              >
                <div
                  style={{ height: "fit-content" }}
                  className="d-flex align-items-center justify-content-between"
                >
                  <div>
                    <h6 className="my-0">Salary Overview</h6>
                    <p className="my-0">View attandance details</p>
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      height: "60vh",
                      overflow: "auto",
                      position: "relative",
                      border: darkMode
                        ? "1px solid rgba(193,189,189)"
                        : "1px solid rgba(193,189,189)",
                    }}
                    className={`scroller  rounded-2 ${Styles.scroller}`}
                  >
                    <table className="table mt-0 mb-0 table-hover">
                      <thead>
                        <tr
                          style={{
                            position: "sticky",
                            top: "-2px",
                            zIndex: "5",
                          }}
                        >
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                          >
                            #
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-0rem",
                              left: "0",
                              zIndex: "5",
                            }}
                          >
                            Full Name
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Employee ID
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Status
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Basic
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            HRA
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Convenyance
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Others
                          </th>
                          <th
                            className="text-center"
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                              background: darkMode
                                ? "rgba(211, 229, 248, 1)"
                                : "rgba(48, 95, 104, 1)",
                            }}
                          >
                            Total Salary
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Days in Month
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Days Payable
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Actual Basic
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Actual HRA
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Actual Convenyance
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Actual Others
                          </th>
                          <th
                            className="text-center"
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                              background: darkMode
                                ? "rgba(211, 248, 217, 1)"
                                : "rgb(51, 97, 59)",
                            }}
                          >
                            Actual Total Salary
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {updates.map((update, index) => (
                          <tr key={index}>
                            <td
                              style={{
                                ...rowBodyStyle(darkMode),
                                background: darkMode ? "#F5F5F5" : "#232424",
                              }}
                              className="text-center border-0"
                            >
                              {" "}
                              {(index + 1).toString().padStart(2, 0)}
                            </td>
                            <td
                              style={{
                                ...rowBodyStyle(darkMode),
                                position: "sticky",
                                left: "0",
                                zIndex: "4",
                                background: darkMode ? "#F5F5F5" : "#232424",
                              }}
                              className="border-0 text-capitalize"
                            >
                              {update.FullName}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {update.empID}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              <td
                                className="p-0"
                                style={rowBodyStyle(darkMode)}
                              >
                                <select
                                  onChange={(e) =>
                                    handleChange(
                                      index,
                                      "status",
                                      e.target.value
                                    )
                                  }
                                  style={{
                                    border: "none",
                                    fontWeight: "600",
                                    width: "fit-content",
                                    color:
                                      update.status === "Paid"
                                        ? "green"
                                        : update.status === "Proceed"
                                        ? "orange"
                                        : update.status === "Hold"
                                        ? "red"
                                        : "gray",
                                  }}
                                  className={`form-select rounded-2 ${
                                    darkMode
                                      ? "bg-light border dark-placeholder"
                                      : "bg-dark border border-black light-placeholder"
                                  }`}
                                  value={update.status}
                                >
                                  <option
                                    value="Paid"
                                    style={{
                                      color: "green",
                                      fontWeight: "600",
                                      width: "100%",
                                    }}
                                  >
                                    Paid
                                  </option>
                                  <option
                                    value="Proceed"
                                    style={{
                                      color: "orange",
                                      fontWeight: "600",
                                      width: "100%",
                                    }}
                                  >
                                    Proceed
                                  </option>
                                  <option
                                    value="Hold"
                                    style={{
                                      color: "red",
                                      fontWeight: "600",
                                      width: "100%",
                                    }}
                                  >
                                    Hold
                                  </option>
                                </select>
                              </td>
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {formatIndianCurrency(update.fixedBasic)}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {formatIndianCurrency(update.fixedHRA)}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {formatIndianCurrency(update.fixedConvenyance)}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {formatIndianCurrency(update.fixedOthers)}
                            </td>
                            <td
                              className="text-center"
                              style={{
                                ...rowBodyStyle(darkMode),
                                background: darkMode
                                  ? "rgba(237, 244, 251, 1)"
                                  : "rgba(48, 95, 104, 0.48)",
                              }}
                            >
                              {" "}
                              {formatIndianCurrency(update.fixedTotalSalary)}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {update.daysInMonth}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {update.totalPayableDays}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {" "}
                              {formatIndianCurrency(update.actualBasic)}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {formatIndianCurrency(update.actualHRA)}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {formatIndianCurrency(update.actualConvenyance)}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {formatIndianCurrency(update.actualOthers)}
                            </td>
                            <td
                              className="text-center"
                              style={{
                                ...rowBodyStyle(darkMode),
                                background: darkMode
                                  ? "rgb(236, 252, 241)"
                                  : "rgba(64, 126, 86, 0.36)",
                              }}
                            >
                              {formatIndianCurrency(update.actualTotalSalary)}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan={2} style={{ ...rowBodyStyle(darkMode) }}>
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 text-start"
                            >
                              Grand Total
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              <span style={{ opacity: "0" }}>0</span>
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              <span style={{ opacity: "0" }}>0</span>
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator + data.fixedBasic,
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator + data.fixedHRA,
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator + data.fixedConvenyance,
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator + data.fixedOthers,
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator + data.fixedTotalSalary,
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              <span style={{ opacity: "0" }}>0</span>
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              <span style={{ opacity: "0" }}>0</span>
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator + data.actualBasic,
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator + data.actualHRA,
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator + data.actualConvenyance,
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator + data.actualOthers,
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator + data.actualTotalSalary,
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div
                  style={{
                    background: darkMode
                      ? "rgb(255, 255, 255)"
                      : "rgba(65, 64, 64, 0.42)",
                    color: darkMode
                      ? "var(--secondaryDashColorDark)"
                      : "var(--primaryDashMenuColor)",
                    width: "100%",
                    position: "sticky",
                    bottom: "0",
                  }}
                  className="p-2 pt-1 my-2 d-flex flex-column gap-2 rounded-3"
                >
                  <div className="d-flex align-items-center mt-2">
                    <button
                      onClick={() => {
                        setIsSalary(false);
                        setIsAttandance(true);
                      }}
                      className={`btn border  d-flex align-items-center gap-2 ${
                        darkMode ? "btn-outline-dark" : "btn-outline-light"
                      }`}
                    >
                      <MdKeyboardArrowLeft className="fs-5" />
                      Previous
                    </button>
                    <button
                      type="submit"
                      className="ms-auto btn btn-primary  d-flex align-items-center gap-2"
                      disabled={salaryLoading} // Disable button while loading
                    >
                      {salaryLoading ? (
                        <span>Loading...</span> // Show loading text or spinner
                      ) : (
                        <>
                          Save & Next
                          <MdKeyboardArrowRight className="fs-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
            {isIncentivandBonus && (
              <form
                onSubmit={handleSubmitBonusandInsentive}
                style={{
                  minHeight: "60vh",
                  maxHeight: "75vh",
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--primaryDashMenuColor)",
                  position: "relative",
                  overflow: "auto",
                }}
                className="d-flex flex-column flex-grow-1 p-2  rounded-2"
              >
                <div
                  style={{ height: "fit-content" }}
                  className="d-flex align-items-center justify-content-between"
                >
                  <div>
                    <h6 className="my-0">Bonus and Incentive</h6>
                    <p className="my-0">View Advance Salary details</p>
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      height: "60vh",
                      overflow: "auto",
                      position: "relative",
                      border: darkMode
                        ? "1px solid rgba(193,189,189)"
                        : "1px solid rgba(193,189,189)",
                    }}
                    className={`scroller  rounded-2 ${Styles.scroller}`}
                  >
                    <table className="table mt-0 mb-0 table-hover">
                      <thead>
                        <tr
                          style={{
                            position: "sticky",
                            top: "-2px",
                            zIndex: "5",
                          }}
                        >
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                          >
                            #
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-0rem",
                              left: "0",
                              zIndex: "5",
                            }}
                          >
                            Full Name
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Employee ID
                          </th>
                          <th
                            className="text-center"
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                              background: darkMode
                                ? "rgba(211, 229, 248, 1)"
                                : "rgba(48, 95, 104, 1)",
                            }}
                          >
                            Actual Salary
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Bonus Type
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Bonus Amount
                          </th>

                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Incentive Type
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Incentive Amount
                          </th>

                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Total Additions
                          </th>
                          <th
                            className="text-center"
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                              background: darkMode
                                ? "rgba(211, 248, 217, 1)"
                                : "rgb(51, 97, 59)",
                            }}
                          >
                            Salary After (B & I)
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Comment
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {updates.map((update, index) => (
                          <tr key={index}>
                            <td
                              style={{
                                ...rowBodyStyle(darkMode),
                                background: darkMode ? "#F5F5F5" : "#232424",
                              }}
                              className="text-center border-0"
                            >
                              {" "}
                              {(index + 1).toString().padStart(2, 0)}
                            </td>
                            <td
                              style={{
                                ...rowBodyStyle(darkMode),
                                position: "sticky",
                                left: "0",
                                zIndex: "4",
                                background: darkMode ? "#F5F5F5" : "#232424",
                              }}
                              className="border-0 text-capitalize"
                            >
                              {update.FullName}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {update.empID}
                            </td>
                            <td
                              className="text-center"
                              style={{
                                ...rowBodyStyle(darkMode),
                                background: darkMode
                                  ? "rgba(237, 244, 251, 1)"
                                  : "rgba(48, 95, 104, 0.48)",
                              }}
                            >
                              {formatIndianCurrency(update.actualTotalSalary)}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              <select
                                className={`form-select mx-auto rounded-2 ${
                                  darkMode
                                    ? "bg-light text-dark border dark-placeholder"
                                    : "bg-dark text-light border border-black light-placeholder"
                                }`}
                                style={{ width: "fit-content", border: "none" }}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "bonusType",
                                    e.target.value
                                  )
                                }
                                value={update.bonusType}
                                name=""
                                id=""
                              >
                                <option value="">--Select Bonus--</option>
                                <option value="Festival">Festival Bonus</option>
                                <option value="Performance">Performance</option>
                                <option value="Referral">Referral Bonus</option>
                                <option value="Special">Special Bonus</option>
                              </select>
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              <input
                                className={`form-control mx-auto rounded-2 ${
                                  darkMode
                                    ? "bg-light text-dark border dark-placeholder"
                                    : "bg-dark text-light border border-black light-placeholder"
                                }`}
                                type="text"
                                style={{
                                  width: "fit-content",
                                  border: "none",
                                  background: "transparent",
                                  textAlign: "center",
                                }}
                                disabled={update.bonusType ? false : true}
                                value={
                                  isNaN(update.bonusAmount) ||
                                  update.bonusAmount === null
                                    ? 0
                                    : update.bonusAmount
                                }
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "bonusAmount",
                                    parseInt(e.target.value)
                                  )
                                }
                              />
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              <select
                                className={`form-select mx-auto rounded-2 ${
                                  darkMode
                                    ? "bg-light text-dark border dark-placeholder"
                                    : "bg-dark text-light border border-black light-placeholder"
                                }`}
                                style={{ width: "fit-content", border: "none" }}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "insentiveType",
                                    e.target.value
                                  )
                                }
                                value={update.insentiveType}
                                name=""
                                id=""
                              >
                                <option value="">--Select Bonus--</option>
                                <option value="Contest">
                                  Contest Incentives
                                </option>
                                <option value="Sales">
                                  {" "}
                                  Sales Performance
                                </option>
                                <option value="Target">
                                  Target Incentives
                                </option>
                                <option value="Tiered">
                                  Tiered Incentives
                                </option>
                              </select>
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              <input
                                className={`form-control mx-auto rounded-2 ${
                                  darkMode
                                    ? "bg-light text-dark border dark-placeholder"
                                    : "bg-dark text-light border border-black light-placeholder"
                                }`}
                                type="text"
                                style={{
                                  width: "fit-content",
                                  border: "none",
                                  background: "transparent",
                                  textAlign: "center",
                                }}
                                disabled={update.insentiveType ? false : true}
                                value={
                                  isNaN(update.insentiveAmount) ||
                                  update.insentiveAmount === null
                                    ? 0
                                    : update.insentiveAmount
                                }
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "insentiveAmount",
                                    parseInt(e.target.value)
                                  )
                                }
                              />
                            </td>

                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {formatIndianCurrency(
                                (Number(update.bonusAmount) || 0) +
                                  (Number(update.insentiveAmount) || 0)
                              )}
                            </td>

                            <td
                              className="text-center"
                              style={{
                                ...rowBodyStyle(darkMode),
                                background: darkMode
                                  ? "rgb(236, 252, 241)"
                                  : "rgba(64, 126, 86, 0.36)",
                              }}
                            >
                              {formatIndianCurrency(
                                Number(update.actualTotalSalary) +
                                  (Number(update.bonusAmount) || 0) +
                                  (Number(update.insentiveAmount) || 0)
                              )}
                            </td>
                            <td
                              className="text-center"
                              style={{
                                ...rowBodyStyle(darkMode),
                              }}
                            >
                              <textarea
                                name=""
                                id=""
                                value={update.additionComment}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "additionComment",
                                    e.target.value
                                  )
                                }
                                placeholder="Your comment"
                                style={{ height: "2rem", minWidth: "200px" }}
                                className={`form-control ms-0 ms-md-auto rounded-2 ${
                                  darkMode
                                    ? "bg-light text-dark border dark-placeholder"
                                    : "bg-dark text-light border border-black light-placeholder"
                                }`}
                              ></textarea>
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan={2} style={{ ...rowBodyStyle(darkMode) }}>
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 text-start"
                            >
                              Grand Total
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              <span style={{ opacity: "0" }}>0</span>
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator +
                                    (Number(data.actualTotalSalary) || 0),
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              <span style={{ opacity: "0" }}>0</span>
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 text-center"
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator +
                                    (Number(data.bonusAmount) || 0),
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              <span style={{ opacity: "0" }}>0</span>
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator +
                                    (Number(data.insentiveAmount) || 0),
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>

                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator +
                                    (Number(data.bonusAmount) || 0),
                                  0 // Initial value of the accumulator
                                ) +
                                  updates.reduce(
                                    (accumulator, data) =>
                                      accumulator +
                                      (Number(data.insentiveAmount) || 0),
                                    0 // Initial value of the accumulator
                                  )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {" "}
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator +
                                    (Number(data.actualTotalSalary) || 0),
                                  0 // Initial value of the accumulator
                                ) +
                                  updates.reduce(
                                    (accumulator, data) =>
                                      accumulator +
                                      (Number(data.bonusAmount) || 0),
                                    0 // Initial value of the accumulator
                                  ) +
                                  updates.reduce(
                                    (accumulator, data) =>
                                      accumulator +
                                      (Number(data.insentiveAmount) || 0),
                                    0 // Initial value of the accumulator
                                  )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              <span style={{ opacity: "0" }}>0</span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div
                  style={{
                    background: darkMode
                      ? "rgb(255, 255, 255)"
                      : "rgba(65, 64, 64, 0.42)",
                    color: darkMode
                      ? "var(--secondaryDashColorDark)"
                      : "var(--primaryDashMenuColor)",
                    width: "100%",
                    position: "sticky",
                    bottom: "0",
                  }}
                  className="p-2 pt-1 my-2 d-flex flex-column gap-2 rounded-3"
                >
                  <div className="d-flex align-items-center mt-2">
                    <button
                      onClick={() => {
                        setIsIncentivandBonus(false);
                        setIsSalary(true);
                      }}
                      className={`btn border  d-flex align-items-center gap-2 ${
                        darkMode ? "btn-outline-dark" : "btn-outline-light"
                      }`}
                    >
                      <MdKeyboardArrowLeft className="fs-5" />
                      Previous
                    </button>
                    <button
                      type="submit"
                      className="ms-auto btn btn-primary  d-flex align-items-center gap-2"
                      disabled={bonusLoading} // Disable button while loading
                    >
                      {bonusLoading ? (
                        <span>Loading...</span> // Show loading text or spinner
                      ) : (
                        <>
                          Save & Next
                          <MdKeyboardArrowRight className="fs-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
            {isArrer && (
              <form
                onSubmit={handleSubmitArrears}
                style={{
                  minHeight: "60vh",
                  maxHeight: "75vh",
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--primaryDashMenuColor)",
                  position: "relative",
                  overflow: "auto",
                }}
                className="d-flex flex-column flex-grow-1 p-2  rounded-2"
              >
                <div
                  style={{ height: "fit-content" }}
                  className="d-flex align-items-center justify-content-between"
                >
                  <div>
                    <h6 className="my-0">Arrears Overview</h6>
                    <p className="my-0">View arrears details</p>
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      height: "60vh",
                      overflow: "auto",
                      position: "relative",
                      border: darkMode
                        ? "1px solid rgba(193,189,189)"
                        : "1px solid rgba(193,189,189)",
                    }}
                    className={`scroller  rounded-2 ${Styles.scroller}`}
                  >
                    <table className="table mt-0 mb-0 table-hover">
                      <thead>
                        <tr
                          style={{
                            position: "sticky",
                            top: "-2px",
                            zIndex: "5",
                          }}
                        >
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                          >
                            #
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-0rem",
                              left: "0",
                              zIndex: "5",
                            }}
                          >
                            Full Name
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Employee ID
                          </th>
                          <th
                            className="text-center"
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                              background: darkMode
                                ? "rgba(211, 229, 248, 1)"
                                : "rgba(48, 95, 104, 1)",
                            }}
                          >
                            Salary after (B & I)
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Arrear Period
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Arrear Payable
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Arrear Deductable
                          </th>
                          <th
                            className="text-center"
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                              background: darkMode
                                ? "rgba(211, 248, 217, 1)"
                                : "rgb(51, 97, 59)",
                            }}
                          >
                            Salary After Arrear
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Comment
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {updates.map((update, index) => (
                          <tr key={index}>
                            <td
                              style={{
                                ...rowBodyStyle(darkMode),
                                background: darkMode ? "#F5F5F5" : "#232424",
                              }}
                              className="text-center border-0"
                            >
                              {" "}
                              {(index + 1).toString().padStart(2, 0)}
                            </td>
                            <td
                              style={{
                                ...rowBodyStyle(darkMode),
                                position: "sticky",
                                left: "0",
                                zIndex: "4",
                                background: darkMode ? "#F5F5F5" : "#232424",
                              }}
                              className="border-0 text-capitalize"
                            >
                              {update.FullName}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {update.empID}
                            </td>
                            <td
                              className="text-center"
                              style={{
                                ...rowBodyStyle(darkMode),
                                background: darkMode
                                  ? "rgba(237, 244, 251, 1)"
                                  : "rgba(48, 95, 104, 0.48)",
                              }}
                            >
                              {formatIndianCurrency(
                                update.salaryaAfterBonusAndInsentive
                              )}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              <input
                                type="date"
                                style={{
                                  // width: "fit-content",
                                  border: "none",
                                  background: "transparent",
                                  textAlign: "center",
                                  textTransform: "uppercase",
                                  height: "2rem",
                                }}
                                className={`mx-auto rounded-2 ${
                                  darkMode
                                    ? `px-2 ${
                                        update.ArrearMonth
                                          ? "text-primary"
                                          : "text-dark"
                                      } dark-placeholder`
                                    : `px-2 ${
                                        update.ArrearMonth
                                          ? "text-primary"
                                          : "text-light"
                                      }  light-placeholder`
                                }`}
                                value={
                                  update.ArrearMonth
                                    ? new Date(update.ArrearMonth)
                                        .toISOString()
                                        .split("T")[0]
                                    : ""
                                }
                                onChange={(e) => {
                                  handleChange(
                                    index,
                                    "ArrearMonth",
                                    e.target.value
                                  );
                                }}
                              />
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              <input
                                type="text"
                                style={{
                                  width: "fit-content",
                                  border: "none",
                                  background: "transparent",
                                  textAlign: "center",
                                }}
                                disabled={update.ArrearMonth ? false : true}
                                className={`form-control mx-auto py-0 rounded-2 ${
                                  darkMode
                                    ? "bg-light text-dark border dark-placeholder"
                                    : "bg-dark text-light border border-black light-placeholder"
                                }`}
                                value={
                                  isNaN(update.ArrearAmountPay)
                                    ? 0
                                    : update.ArrearAmountPay
                                }
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "ArrearAmountPay",
                                    parseInt(e.target.value)
                                  )
                                }
                              />
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              <input
                                type="text"
                                style={{
                                  width: "fit-content",
                                  border: "none",
                                  background: "transparent",
                                  textAlign: "center",
                                }}
                                disabled={update.ArrearMonth ? false : true}
                                className={`form-control mx-auto py-0 rounded-2 ${
                                  darkMode
                                    ? "bg-light text-dark border dark-placeholder"
                                    : "bg-dark text-light border border-black light-placeholder"
                                }`}
                                value={
                                  isNaN(update.ArrearAmountDeduct)
                                    ? 0
                                    : update.ArrearAmountDeduct
                                }
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "ArrearAmountDeduct",
                                    parseInt(e.target.value)
                                  )
                                }
                              />
                            </td>
                            <td
                              className="text-center"
                              style={{
                                ...rowBodyStyle(darkMode),
                                background: darkMode
                                  ? "rgb(236, 252, 241)"
                                  : "rgba(64, 126, 86, 0.36)",
                              }}
                            >
                              {formatIndianCurrency(
                                (Number(update.salaryaAfterBonusAndInsentive) ||
                                  0) +
                                  (Number(update.ArrearAmountPay) || 0) -
                                  (Number(update.ArrearAmountDeduct) || 0)
                              )}
                            </td>
                            <td
                              className="text-center"
                              style={{
                                ...rowBodyStyle(darkMode),
                              }}
                            >
                              <textarea
                                name=""
                                id=""
                                value={update.arrearMessage}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "arrearMessage",
                                    e.target.value
                                  )
                                }
                                placeholder="Your comment"
                                style={{ height: "2rem", minWidth: "200px" }}
                                className={`form-control ms-0 ms-md-auto rounded-2 ${
                                  darkMode
                                    ? "bg-light text-dark border dark-placeholder"
                                    : "bg-dark text-light border border-black light-placeholder"
                                }`}
                              ></textarea>
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan={2} style={{ ...rowBodyStyle(darkMode) }}>
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 text-start"
                            >
                              Grand Total
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              <span style={{ opacity: "0" }}>0</span>
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator +
                                    data.salaryaAfterBonusAndInsentive,
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              <span style={{ opacity: "0" }}>0</span>
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator +
                                    (Number(data.ArrearAmountPay) || 0),
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator +
                                    (Number(data.ArrearAmountDeduct) || 0),
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator +
                                    (Number(
                                      data.salaryaAfterBonusAndInsentive
                                    ) || 0),
                                  0 // Initial value of the accumulator
                                ) +
                                  updates.reduce(
                                    (accumulator, data) =>
                                      accumulator +
                                      (Number(data.ArrearAmountPay) || 0),
                                    0 // Initial value of the accumulator
                                  ) +
                                  updates.reduce(
                                    (accumulator, data) =>
                                      accumulator +
                                      (Number(data.ArrearAmountDeduct) || 0),
                                    0 // Initial value of the accumulator
                                  )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              <span style={{ opacity: "0" }}>0</span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div
                  style={{
                    background: darkMode
                      ? "rgb(255, 255, 255)"
                      : "rgba(65, 64, 64, 0.42)",
                    color: darkMode
                      ? "var(--secondaryDashColorDark)"
                      : "var(--primaryDashMenuColor)",
                    width: "100%",
                    position: "sticky",
                    bottom: "0",
                  }}
                  className="p-2 pt-1 my-2 d-flex flex-column gap-2 rounded-3"
                >
                  <div className="d-flex align-items-center mt-2">
                    <button
                      onClick={() => {
                        setIsArrer(false);
                        setIsIncentivandBonus(true);
                      }}
                      className={`btn border  d-flex align-items-center gap-2 ${
                        darkMode ? "btn-outline-dark" : "btn-outline-light"
                      }`}
                    >
                      <MdKeyboardArrowLeft className="fs-5" />
                      Previous
                    </button>
                    <button
                      type="submit"
                      className="ms-auto btn btn-primary  d-flex align-items-center gap-2"
                      disabled={arrearsLoading} // Disable button while loading
                    >
                      {arrearsLoading ? (
                        <span>Loading...</span> // Show loading text or spinner
                      ) : (
                        <>
                          Save & Next
                          <MdKeyboardArrowRight className="fs-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
            {isAdvance && (
              <form
                onSubmit={handleSubmitAdvance}
                style={{
                  minHeight: "60vh",
                  maxHeight: "75vh",
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--primaryDashMenuColor)",
                  position: "relative",
                  overflow: "auto",
                }}
                className="d-flex flex-column flex-grow-1 p-2  rounded-2"
              >
                <div
                  style={{ height: "fit-content" }}
                  className="d-flex align-items-center justify-content-between"
                >
                  <div>
                    <h6 className="my-0">Advance Salary</h6>
                    <p className="my-0">View Advance Salary details</p>
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      height: "60vh",
                      overflow: "auto",
                      position: "relative",
                      border: darkMode
                        ? "1px solid rgba(193,189,189)"
                        : "1px solid rgba(193,189,189)",
                    }}
                    className={`scroller  rounded-2 ${Styles.scroller}`}
                  >
                    <table className="table mt-0 mb-0 table-hover">
                      <thead>
                        <tr
                          style={{
                            position: "sticky",
                            top: "-2px",
                            zIndex: "5",
                          }}
                        >
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                          >
                            #
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-0rem",
                              left: "0",
                              zIndex: "5",
                            }}
                          >
                            Full Name
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Employee ID
                          </th>
                          <th
                            className="text-center"
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                              background: darkMode
                                ? "rgba(211, 229, 248, 1)"
                                : "rgba(48, 95, 104, 1)",
                            }}
                          >
                            Salary after Arrear
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Advance Duration (in Month)
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Previous Advance
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Advance Pay
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Advance Deduct
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Advance Balance
                          </th>
                          <th
                            className="text-center"
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                              background: darkMode
                                ? "rgba(211, 248, 217, 1)"
                                : "rgb(51, 97, 59)",
                            }}
                          >
                            Salary After Advance
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Reasion For Advance
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {updates.map((update, index) => (
                          <tr key={index}>
                            <td
                              style={{
                                ...rowBodyStyle(darkMode),
                                background: darkMode ? "#F5F5F5" : "#232424",
                              }}
                              className="text-center border-0"
                            >
                              {" "}
                              {(index + 1).toString().padStart(2, 0)}
                            </td>
                            <td
                              style={{
                                ...rowBodyStyle(darkMode),
                                position: "sticky",
                                left: "0",
                                zIndex: "4",
                                background: darkMode ? "#F5F5F5" : "#232424",
                              }}
                              className="border-0 text-capitalize"
                            >
                              {update.FullName}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {update.empID}
                            </td>
                            <td
                              className="text-center"
                              style={{
                                ...rowBodyStyle(darkMode),
                                background: darkMode
                                  ? "rgba(237, 244, 251, 1)"
                                  : "rgba(48, 95, 104, 0.48)",
                              }}
                            >
                              {formatIndianCurrency(
                                update.SalaryAfterArrearAmt
                              )}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              <input
                                type="text"
                                style={{
                                  width: "fit-content",
                                  border: "none",
                                  background: "transparent",
                                  textAlign: "center",
                                }}
                                className={`form-control mx-auto rounded-2 ${
                                  darkMode
                                    ? "bg-light text-dark border dark-placeholder"
                                    : "bg-dark text-light border border-black light-placeholder"
                                }`}
                                value={
                                  isNaN(update.advanceDuration)
                                    ? 0
                                    : update.advanceDuration
                                }
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "advanceDuration",
                                    parseInt(e.target.value)
                                  )
                                }
                              />
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {formatIndianCurrency(update.PreviousAdvance)}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              <input
                                type="text"
                                style={{
                                  width: "fit-content",
                                  border: "none",
                                  background: "transparent",
                                  textAlign: "center",
                                }}
                                className={`form-control mx-auto rounded-2 ${
                                  darkMode
                                    ? "bg-light text-dark border dark-placeholder"
                                    : "bg-dark text-light border border-black light-placeholder"
                                }`}
                                value={
                                  isNaN(update.advanceAmountPay)
                                    ? 0
                                    : update.advanceAmountPay
                                }
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "advanceAmountPay",
                                    parseInt(e.target.value)
                                  )
                                }
                              />
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              <input
                                type="text"
                                style={{
                                  width: "fit-content",
                                  border: "none",
                                  background: "transparent",
                                  textAlign: "center",
                                }}
                                className={`form-control mx-auto rounded-2 ${
                                  darkMode
                                    ? "bg-light text-dark border dark-placeholder"
                                    : "bg-dark text-light border border-black light-placeholder"
                                }`}
                                value={
                                  isNaN(update.advanceAmountDeduct)
                                    ? 0
                                    : update.advanceAmountDeduct
                                }
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "advanceAmountDeduct",
                                    parseInt(e.target.value)
                                  )
                                }
                              />
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {formatIndianCurrency(
                                (Number(update.PreviousAdvance) || 0) +
                                  (Number(update.advanceAmountPay) || 0) -
                                  (Number(update.advanceAmountDeduct) || 0)
                              )}
                            </td>

                            <td
                              className="text-center"
                              style={{
                                ...rowBodyStyle(darkMode),
                                background: darkMode
                                  ? "rgb(236, 252, 241)"
                                  : "rgba(64, 126, 86, 0.36)",
                              }}
                            >
                              {formatIndianCurrency(
                                (Number(update.SalaryAfterArrearAmt) || 0) +
                                  (Number(update.advanceAmountPay) || 0) -
                                  (Number(update.advanceAmountDeduct) || 0)
                              )}
                            </td>
                            <td
                              className="text-center"
                              style={{
                                ...rowBodyStyle(darkMode),
                              }}
                            >
                              <textarea
                                name=""
                                id=""
                                value={update.ReasionForAdvance}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "ReasionForAdvance",
                                    e.target.value
                                  )
                                }
                                style={{ height: "2rem", minWidth: "200px" }}
                                className={`form-control ms-0 ms-md-auto rounded-2 ${
                                  darkMode
                                    ? "bg-light text-dark border dark-placeholder"
                                    : "bg-dark text-light border border-black light-placeholder"
                                }`}
                              ></textarea>
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan={2} style={{ ...rowBodyStyle(darkMode) }}>
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 text-start"
                            >
                              Grand Total
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              <span style={{ opacity: "0" }}>0</span>
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator + data.SalaryAfterArrearAmt,
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              <span style={{ opacity: "0" }}>0</span>
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator + data.PreviousAdvance,
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator +
                                    (Number(data.advanceAmountPay) || 0),
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator +
                                    (Number(data.advanceAmountDeduct) || 0),
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {" "}
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator +
                                    (Number(data.PreviousAdvance) || 0),
                                  0 // Initial value of the accumulator
                                ) +
                                  updates.reduce(
                                    (accumulator, data) =>
                                      accumulator +
                                      (Number(data.advanceAmountPay) || 0),
                                    0 // Initial value of the accumulator
                                  ) -
                                  updates.reduce(
                                    (accumulator, data) =>
                                      accumulator +
                                      (Number(data.advanceAmountDeduct) || 0),
                                    0 // Initial value of the accumulator
                                  )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator +
                                    (Number(data.SalaryAfterArrearAmt) || 0),
                                  0 // Initial value of the accumulator
                                ) +
                                  updates.reduce(
                                    (accumulator, data) =>
                                      accumulator +
                                      (Number(data.advanceAmountPay) || 0),
                                    0 // Initial value of the accumulator
                                  ) -
                                  updates.reduce(
                                    (accumulator, data) =>
                                      accumulator +
                                      (Number(data.advanceAmountDeduct) || 0),
                                    0 // Initial value of the accumulator
                                  )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              <span style={{ opacity: "0" }}>0</span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div
                  style={{
                    background: darkMode
                      ? "rgb(255, 255, 255)"
                      : "rgba(65, 64, 64, 0.42)",
                    color: darkMode
                      ? "var(--secondaryDashColorDark)"
                      : "var(--primaryDashMenuColor)",
                    width: "100%",
                    position: "sticky",
                    bottom: "0",
                  }}
                  className="p-2 pt-1 my-2 d-flex flex-column gap-2 rounded-3"
                >
                  <div className="d-flex align-items-center mt-2">
                    <button
                      onClick={() => {
                        setIsAdvance(false);
                        setIsArrer(true);
                      }}
                      className={`btn border  d-flex align-items-center gap-2 ${
                        darkMode ? "btn-outline-dark" : "btn-outline-light"
                      }`}
                    >
                      <MdKeyboardArrowLeft className="fs-5" />
                      Previous
                    </button>
                    <button
                      type="submit"
                      className="ms-auto btn btn-primary  d-flex align-items-center gap-2"
                      disabled={advanceLoading} // Disable button while loading
                    >
                      {advanceLoading ? (
                        <span>Loading...</span> // Show loading text or spinner
                      ) : (
                        <>
                          Save & Next
                          <MdKeyboardArrowRight className="fs-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
            {isDeduction && (
              <form
                onSubmit={handleSubmitDeductions}
                style={{
                  minHeight: "60vh",
                  maxHeight: "75vh",
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--primaryDashMenuColor)",
                  position: "relative",
                  overflow: "auto",
                }}
                className="d-flex flex-column flex-grow-1 p-2  rounded-2"
              >
                <div
                  style={{ height: "fit-content" }}
                  className="d-flex align-items-center justify-content-between"
                >
                  <div>
                    <h6 className="my-0">Deductions Overview</h6>
                    <p className="my-0">
                      View PF, ESI, and TDS Deduction details
                    </p>
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      height: "60vh",
                      overflow: "auto",
                      position: "relative",
                      border: darkMode
                        ? "1px solid rgba(193,189,189)"
                        : "1px solid rgba(193,189,189)",
                    }}
                    className={`scroller  rounded-2 ${Styles.scroller}`}
                  >
                    <table className="table mt-0 mb-0 table-hover">
                      <thead>
                        <tr
                          style={{
                            position: "sticky",
                            top: "-2px",
                            zIndex: "5",
                          }}
                        >
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                          >
                            #
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-0rem",
                              left: "0",
                              zIndex: "5",
                            }}
                          >
                            Full Name
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Employee ID
                          </th>
                          <th
                            className="text-center"
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                              background: darkMode
                                ? "rgba(211, 229, 248, 1)"
                                : "rgba(48, 95, 104, 1)",
                            }}
                          >
                            Salary after Advance
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            ESI
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            EPF
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            TDS
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Total Deductions
                          </th>
                          <th
                            className="text-center"
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                              background: darkMode
                                ? "rgba(211, 248, 217, 1)"
                                : "rgb(51, 97, 59)",
                            }}
                          >
                            Salary After Deductions
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Comment
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {updates.map((update, index) => (
                          <tr key={index}>
                            <td
                              style={{
                                ...rowBodyStyle(darkMode),
                                background: darkMode ? "#F5F5F5" : "#232424",
                              }}
                              className="text-center border-0"
                            >
                              {" "}
                              {(index + 1).toString().padStart(2, 0)}
                            </td>
                            <td
                              style={{
                                ...rowBodyStyle(darkMode),
                                position: "sticky",
                                left: "0",
                                zIndex: "4",
                                background: darkMode ? "#F5F5F5" : "#232424",
                              }}
                              className="border-0 text-capitalize"
                            >
                              {update.FullName}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {update.empID}
                            </td>
                            <td
                              className="text-center"
                              style={{
                                ...rowBodyStyle(darkMode),
                                background: darkMode
                                  ? "rgba(237, 244, 251, 1)"
                                  : "rgba(48, 95, 104, 0.48)",
                              }}
                            >
                              {formatIndianCurrency(update.salaryAfterAdvance)}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              <input
                                type="text"
                                style={{
                                  width: "fit-content",
                                  border: "none",
                                  background: "transparent",
                                  textAlign: "center",
                                }}
                                className={`form-control mx-auto py-0 rounded-2 ${
                                  darkMode
                                    ? "bg-light text-dark border dark-placeholder"
                                    : "bg-dark text-light border border-black light-placeholder"
                                }`}
                                value={
                                  isNaN(update.ESIDedeuction)
                                    ? 0
                                    : update.ESIDedeuction
                                }
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "ESIDedeuction",
                                    parseInt(e.target.value)
                                  )
                                }
                              />
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              <input
                                type="text"
                                style={{
                                  width: "fit-content",
                                  border: "none",
                                  background: "transparent",
                                  textAlign: "center",
                                }}
                                className={`form-control mx-auto py-0 rounded-2 ${
                                  darkMode
                                    ? "bg-light text-dark border dark-placeholder"
                                    : "bg-dark text-light border border-black light-placeholder"
                                }`}
                                value={
                                  isNaN(update.PFDeduction)
                                    ? 0
                                    : update.PFDeduction
                                }
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "PFDeduction",
                                    parseInt(e.target.value)
                                  )
                                }
                              />
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              <input
                                type="text"
                                style={{
                                  width: "fit-content",
                                  border: "none",
                                  background: "transparent",
                                  textAlign: "center",
                                }}
                                value={
                                  isNaN(update.TDSDeduction)
                                    ? 0
                                    : update.TDSDeduction
                                }
                                className={`form-control mx-auto py-0 rounded-2 ${
                                  darkMode
                                    ? "bg-light text-dark border dark-placeholder"
                                    : "bg-dark text-light border border-black light-placeholder"
                                }`}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "TDSDeduction",
                                    parseInt(e.target.value)
                                  )
                                }
                              />
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {formatIndianCurrency(
                                (Number(update.ESIDedeuction) || 0) +
                                  (Number(update.PFDeduction) || 0) +
                                  (Number(update.TDSDeduction) || 0)
                              )}
                            </td>
                            <td
                              className="text-center"
                              style={{
                                ...rowBodyStyle(darkMode),
                                background: darkMode
                                  ? "rgb(236, 252, 241)"
                                  : "rgba(64, 126, 86, 0.36)",
                              }}
                            >
                              {formatIndianCurrency(
                                Number(update.salaryAfterAdvance) -
                                  ((Number(update.ESIDedeuction) || 0) +
                                    (Number(update.PFDeduction) || 0) +
                                    (Number(update.TDSDeduction) || 0))
                              )}
                            </td>
                            <td
                              className="text-center"
                              style={{
                                ...rowBodyStyle(darkMode),
                              }}
                            >
                              <textarea
                                name=""
                                id=""
                                value={update.deductionNotes}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "deductionNotes",
                                    e.target.value
                                  )
                                }
                                placeholder="Your comment"
                                style={{ height: "2rem", minWidth: "200px" }}
                                className={`form-control ms-0 ms-md-auto rounded-2 ${
                                  darkMode
                                    ? "bg-light text-dark border dark-placeholder"
                                    : "bg-dark text-light border border-black light-placeholder"
                                }`}
                              ></textarea>
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan={2} style={{ ...rowBodyStyle(darkMode) }}>
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 text-start"
                            >
                              Grand Total
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              <span style={{ opacity: "0" }}>0</span>
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator +
                                    (Number(data.salaryAfterAdvance) || 0),
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator +
                                    (Number(data.ESIDedeuction) || 0),
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator +
                                    (Number(data.PFDeduction) || 0),
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator +
                                    (Number(data.TDSDeduction) || 0),
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator +
                                    (Number(data.ESIDedeuction) || 0),
                                  0 // Initial value of the accumulator
                                ) +
                                  updates.reduce(
                                    (accumulator, data) =>
                                      accumulator +
                                      (Number(data.PFDeduction) || 0),
                                    0 // Initial value of the accumulator
                                  ) +
                                  updates.reduce(
                                    (accumulator, data) =>
                                      accumulator +
                                      (Number(data.TDSDeduction) || 0),
                                    0 // Initial value of the accumulator
                                  )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator +
                                    (Number(data.SalaryAfterArrearAmt) || 0),
                                  0 // Initial value of the accumulator
                                ) -
                                  updates.reduce(
                                    (accumulator, data) =>
                                      accumulator +
                                      (Number(data.ESIDedeuction) || 0),
                                    0 // Initial value of the accumulator
                                  ) -
                                  updates.reduce(
                                    (accumulator, data) =>
                                      accumulator +
                                      (Number(data.PFDeduction) || 0),
                                    0 // Initial value of the accumulator
                                  ) -
                                  updates.reduce(
                                    (accumulator, data) =>
                                      accumulator +
                                      (Number(data.TDSDeduction) || 0),
                                    0 // Initial value of the accumulator
                                  )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              <span style={{ opacity: "0" }}>0</span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div
                  style={{
                    background: darkMode
                      ? "rgb(255, 255, 255)"
                      : "rgba(65, 64, 64, 0.42)",
                    color: darkMode
                      ? "var(--secondaryDashColorDark)"
                      : "var(--primaryDashMenuColor)",
                    width: "100%",
                    position: "sticky",
                    bottom: "0",
                  }}
                  className="p-2 pt-1 my-2 d-flex flex-column gap-2 rounded-3"
                >
                  <div className="d-flex align-items-center mt-2">
                    <button
                      onClick={() => {
                        setIsDeduction(false);
                        setIsAdvance(true);
                      }}
                      className={`btn border  d-flex align-items-center gap-2 ${
                        darkMode ? "btn-outline-dark" : "btn-outline-light"
                      }`}
                    >
                      <MdKeyboardArrowLeft className="fs-5" />
                      Previous
                    </button>
                    <button
                      type="submit"
                      className="ms-auto btn btn-primary  d-flex align-items-center gap-2"
                      disabled={deductionsLoading} // Disable button while loading
                    >
                      {deductionsLoading ? (
                        <span>Loading...</span> // Show loading text or spinner
                      ) : (
                        <>
                          Save & Next
                          <MdKeyboardArrowRight className="fs-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
            {isReimbursment && (
              <form
                onSubmit={handleSubmitReimbursment}
                style={{
                  minHeight: "60vh",
                  maxHeight: "75vh",
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--primaryDashMenuColor)",
                  position: "relative",
                  overflow: "auto",
                }}
                className="d-flex flex-column flex-grow-1 p-2  rounded-2"
              >
                <div
                  style={{ height: "fit-content" }}
                  className="d-flex align-items-center justify-content-between"
                >
                  <div>
                    <h6 className="my-0">Reimbursment Overview</h6>
                    <p className="my-0">View Employee's Reimbursment Details</p>
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      height: "60vh",
                      overflow: "auto",
                      position: "relative",
                      border: darkMode
                        ? "1px solid rgba(193,189,189)"
                        : "1px solid rgba(193,189,189)",
                    }}
                    className={`scroller  rounded-2 ${Styles.scroller}`}
                  >
                    <table className="table mt-0 mb-0 table-hover">
                      <thead>
                        <tr
                          style={{
                            position: "sticky",
                            top: "-2px",
                            zIndex: "5",
                          }}
                        >
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                          >
                            #
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-0rem",
                              left: "0",
                              zIndex: "5",
                            }}
                          >
                            Full Name
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Employee ID
                          </th>
                          <th
                            className="text-center"
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                              background: darkMode
                                ? "rgba(211, 229, 248, 1)"
                                : "rgba(48, 95, 104, 1)",
                            }}
                          >
                            Salary after Deduction
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Reimbursment Applied
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Reimbursment Approved
                          </th>
                          <th
                            className="text-center"
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                              background: darkMode
                                ? "rgba(211, 248, 217, 1)"
                                : "rgb(51, 97, 59)",
                            }}
                          >
                            Salary After Reimbursment
                          </th>
                          <th
                            style={{
                              ...rowHeadStyle(darkMode),
                              position: "sticky",
                              top: "-.5rem",
                            }}
                            className="text-center"
                          >
                            Comment
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {updates.map((update, index) => (
                          <tr key={index}>
                            <td
                              style={{
                                ...rowBodyStyle(darkMode),
                                background: darkMode ? "#F5F5F5" : "#232424",
                              }}
                              className="text-center border-0"
                            >
                              {" "}
                              {(index + 1).toString().padStart(2, 0)}
                            </td>
                            <td
                              style={{
                                ...rowBodyStyle(darkMode),
                                position: "sticky",
                                left: "0",
                                zIndex: "4",
                                background: darkMode ? "#F5F5F5" : "#232424",
                              }}
                              className="border-0 text-capitalize"
                            >
                              {update.FullName}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {update.empID}
                            </td>
                            <td
                              className="text-center"
                              style={{
                                ...rowBodyStyle(darkMode),
                                background: darkMode
                                  ? "rgba(237, 244, 251, 1)"
                                  : "rgba(48, 95, 104, 0.48)",
                              }}
                            >
                              {formatIndianCurrency(
                                update.salaryAfterPFESIandTDS
                              )}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {formatIndianCurrency(update.reimbursmentApplied)}
                            </td>
                            <td
                              className="text-center"
                              style={rowBodyStyle(darkMode)}
                            >
                              {" "}
                              {formatIndianCurrency(
                                update.reimbursmentApproved
                              )}
                            </td>
                            <td
                              className="text-center"
                              style={{
                                ...rowBodyStyle(darkMode),
                                background: darkMode
                                  ? "rgb(236, 252, 241)"
                                  : "rgba(64, 126, 86, 0.36)",
                              }}
                            >
                              {formatIndianCurrency(
                                update.salaryAfterPFESIandTDS +
                                  update.reimbursmentApproved
                              )}
                            </td>
                            <td
                              className="text-center"
                              style={{
                                ...rowBodyStyle(darkMode),
                              }}
                            >
                              <textarea
                                name=""
                                id=""
                                value={update.reimbursmentNotes}
                                onChange={(e) =>
                                  handleChange(
                                    index,
                                    "reimbursmentNotes",
                                    e.target.value
                                  )
                                }
                                placeholder="Your comment"
                                style={{ height: "2rem", minWidth: "200px" }}
                                className={`form-control ms-0 ms-md-auto rounded-2 ${
                                  darkMode
                                    ? "bg-light text-dark border dark-placeholder"
                                    : "bg-dark text-light border border-black light-placeholder"
                                }`}
                              ></textarea>
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan={2} style={{ ...rowBodyStyle(darkMode) }}>
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 text-start"
                            >
                              Grand Total
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              <span style={{ opacity: "0" }}>0</span>
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator + data.salaryAfterPFESIandTDS,
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator + data.reimbursmentApplied,
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator + data.reimbursmentApproved,
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              {formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator + data.salaryAfterReimbursment,
                                  0 // Initial value of the accumulator
                                )
                              )}
                            </div>
                          </td>
                          <td
                            style={{ ...rowBodyStyle(darkMode), padding: "0" }}
                            className="text-center"
                          >
                            <div
                              style={{
                                borderTop: `1px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                borderBottom: `2px solid ${
                                  darkMode
                                    ? "rgba(0,0,0,.4)"
                                    : "rgba(119, 117, 117, 0.4)"
                                }`,
                                fontWeight: "600",
                              }}
                              className="py-2 "
                            >
                              <span style={{ opacity: "0" }}>0</span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div
                  style={{
                    background: darkMode
                      ? "rgb(255, 255, 255)"
                      : "rgba(65, 64, 64, 0.42)",
                    color: darkMode
                      ? "var(--secondaryDashColorDark)"
                      : "var(--primaryDashMenuColor)",
                    width: "100%",
                    position: "sticky",
                    bottom: "0",
                  }}
                  className="p-2 pt-1 my-2 d-flex flex-column gap-2 rounded-3"
                >
                  <div className="d-flex align-items-center mt-2">
                    <button
                      onClick={() => {
                        setIsReimbursment(false);
                        setIsDeduction(true);
                      }}
                      className={`btn border  d-flex align-items-center gap-2 ${
                        darkMode ? "btn-outline-dark" : "btn-outline-light"
                      }`}
                    >
                      <MdKeyboardArrowLeft className="fs-5" />
                      Previous
                    </button>
                    <button
                      type="submit"
                      className="ms-auto btn btn-primary  d-flex align-items-center gap-2"
                      disabled={reimbursmentLoading} // Disable button while loading
                    >
                      {reimbursmentLoading ? (
                        <span>Loading...</span> // Show loading text or spinner
                      ) : (
                        <>
                          Save & Next
                          <MdKeyboardArrowRight className="fs-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {isPayslip && (
              <form
                onSubmit={handleSubmitSalarySummary}
                style={{
                  height: "fit-content",
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--primaryDashMenuColor)",
                  position: "relative",
                  overflow: "auto",
                }}
                className="d-flex flex-column flex-grow-1 p-3  rounded-2"
              >
                <div
                  style={{ height: "fit-content" }}
                  className="d-flex align-items-center justify-content-between"
                >
                  <div>
                    <h6 className="my-0">Salary Summary</h6>
                    <p className="my-0">View Final Salary Summary</p>
                  </div>
                </div>
                <div
                  style={{
                    height: "fit-content",
                    position: "relative",
                  }}
                  className="rounded-2"
                >
                  {/* <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      rowGap: ".5rem",
                    }}
                  >
                    <div
                      style={{
                        height: "6rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={PayrollSummaryImage}
                        style={{ height: "100%", width: "auto" }}
                        alt="PayrollSummary"
                        className="mx-auto"
                      />
                    </div>
                    <h5 className="my-0 ">Right Time To Send Salary Slip!</h5>
                    <p className="my-0 ">
                      Send salary slips to employees before 7th of every month
                      to confirm!
                    </p>
                  </div> */}
                  <div
                    className="rounded-2 mt-4 p-3 pb-1"
                    style={{
                      height: "fit-content",
                      width: "100%",
                      position: "relative",
                      background: darkMode ? "white" : "black",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <h5>Summary</h5>
                      <span className="d-flex align-items-center gap-2">
                        {updates.length}
                        <p className="m-0">
                          Salary slips ready for distribution
                        </p>
                      </span>
                    </div>
                    <table
                      style={{
                        color: darkMode
                          ? "rgba(41, 40, 40, 0.83)"
                          : "rgba(238, 236, 236, 0.89)",
                      }}
                      className="table"
                    >
                      <tr>
                        <td
                          className="text-start pl-3"
                          style={{ fontSize: "1rem" }}
                        >
                          Total Employee
                        </td>
                        <td className="text-end pr-3">{updates.length} Nos.</td>
                      </tr>
                      <tr>
                        <td
                          className="text-start pl-3"
                          style={{ fontSize: "1rem" }}
                        >
                          Total Gross Salary
                        </td>
                        <td className="text-end pr-3">
                          {formatIndianCurrency(
                            updates.reduce(
                              (accumulator, data) =>
                                accumulator + data.actualTotalSalary,
                              0 // Initial value of the accumulator
                            )
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="text-start pl-3"
                          style={{ fontSize: "1rem" }}
                        >
                          Total Bonus & Incentive
                        </td>
                        <td className="text-end pr-3">
                          {formatIndianCurrency(
                            updates.reduce(
                              (accumulator, data) =>
                                accumulator + data.totalBNIAdditions,
                              0 // Initial value of the accumulator
                            )
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="text-start pl-3"
                          style={{ fontSize: "1rem" }}
                        >
                          Total Arrears Adjusted
                        </td>
                        <td className="text-end pr-3">
                          {updates.reduce(
                            (accumulator, data) =>
                              accumulator + data.ArrearAmountPay,
                            0 // Initial value of the accumulator
                          ) -
                            updates.reduce(
                              (accumulator, data) =>
                                accumulator + data.ArrearAmountDeduct,
                              0 // Initial value of the accumulator
                            ) <
                          0
                            ? `( ${formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator + data.ArrearAmountDeduct,
                                  0 // Initial value of the accumulator
                                ) -
                                  updates.reduce(
                                    (accumulator, data) =>
                                      accumulator + data.ArrearAmountPay,
                                    0 // Initial value of the accumulator
                                  )
                              )} )`
                            : formatIndianCurrency(
                                updates.reduce(
                                  (accumulator, data) =>
                                    accumulator + data.ArrearAmountPay,
                                  0 // Initial value of the accumulator
                                ) -
                                  updates.reduce(
                                    (accumulator, data) =>
                                      accumulator + data.ArrearAmountDeduct,
                                    0 // Initial value of the accumulator
                                  )
                              )}
                        </td>
                      </tr>

                      <tr>
                        <td
                          className="text-start pl-3"
                          style={{ fontSize: "1rem" }}
                        >
                          Total Advance Distributed
                        </td>
                        <td className="text-end pr-3">
                          {formatIndianCurrency(
                            updates.reduce(
                              (accumulator, data) =>
                                accumulator + data.advanceAmountPay,
                              0 // Initial value of the accumulator
                            )
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="text-start pl-3"
                          style={{ fontSize: "1rem" }}
                        >
                          Total Advance Collected
                        </td>
                        <td className="text-end pr-3">
                          (
                          {formatIndianCurrency(
                            updates.reduce(
                              (accumulator, data) =>
                                accumulator + data.advanceAmountDeduct,
                              0 // Initial value of the accumulator
                            )
                          )}
                          )
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="text-start pl-3"
                          style={{ fontSize: "1rem" }}
                        >
                          Total Deductions (ESI, PF & TDS)
                        </td>
                        <td className="text-end pr-3">
                          (
                          {formatIndianCurrency(
                            updates.reduce(
                              (accumulator, data) =>
                                accumulator + data.totalDeductionsAmount,
                              0 // Initial value of the accumulator
                            )
                          )}
                          )
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="text-start pl-3"
                          style={{ fontSize: "1rem" }}
                        >
                          Total Reimbursement
                        </td>
                        <td className="text-end pr-3">
                          {formatIndianCurrency(
                            updates.reduce(
                              (accumulator, data) =>
                                accumulator + data.reimbursmentApproved,
                              0 // Initial value of the accumulator
                            )
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <h6
                            className="bg-primary text-white"
                            style={{
                              borderTop: `1px solid ${
                                darkMode
                                  ? "rgba(26, 25, 25, 0.2)"
                                  : "rgba(26, 25, 25, 0.2)"
                              }`,
                              borderBottom: `3px solid ${
                                darkMode
                                  ? "rgba(26, 25, 25, 0.2)"
                                  : "rgba(26, 25, 25, 0.2)"
                              }`,
                              width: "25%",
                            }}
                          >
                            Net Payable
                          </h6>
                        </td>
                        <td className="text-end">
                          <h6
                            className="bg-primary text-white ms-auto"
                            style={{
                              borderTop: `1px solid ${
                                darkMode
                                  ? "rgba(26, 25, 25, 0.2)"
                                  : "rgba(26, 25, 25, 0.2)"
                              }`,
                              borderBottom: `3px solid ${
                                darkMode
                                  ? "rgba(26, 25, 25, 0.2)"
                                  : "rgba(26, 25, 25, 0.2)"
                              }`,
                              width: "30%",
                            }}
                          >
                            {formatIndianCurrency(
                              updates.reduce(
                                (accumulator, data) =>
                                  accumulator + data.salaryAfterReimbursment,
                                0
                              )
                            )}
                          </h6>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
                <div
                  style={{
                    background: darkMode
                      ? "rgb(255, 255, 255)"
                      : "rgba(65, 64, 64, 0.42)",
                    color: darkMode
                      ? "var(--secondaryDashColorDark)"
                      : "var(--primaryDashMenuColor)",
                    width: "100%",
                    position: "sticky",
                    bottom: "0",
                  }}
                  className="p-2 pt-1 my-2 d-flex flex-column gap-2 rounded-3"
                >
                  <div className="d-flex align-items-center mt-2">
                    <button
                      onClick={() => {
                        setIsPayslip(false);
                        setIsReimbursment(true);
                      }}
                      className={`btn border  d-flex align-items-center gap-2 ${
                        darkMode ? "btn-outline-dark" : "btn-outline-light"
                      }`}
                    >
                      <MdKeyboardArrowLeft className="fs-5" />
                      Previous
                    </button>
                    <button
                      type="submit"
                      className="ms-auto btn btn-primary  d-flex align-items-center gap-2"
                    >
                      Publish Payslips
                    </button>
                  </div>
                </div>
              </form>
            )}
            {isPayslipSent && (
              <form
                onSubmit={handleSubmitPayslipSummary}
                style={{
                  height: "75vh",
                  background: darkMode
                    ? "rgb(255, 255, 255)"
                    : "rgba(65, 64, 64, 0.42)",
                  color: darkMode
                    ? "var(--secondaryDashColorDark)"
                    : "var(--primaryDashMenuColor)",
                  position: "relative",
                  overflow: "auto",
                }}
                className="d-flex flex-column flex-grow-1 p-3  rounded-2"
              >
                <div
                  style={{ height: "fit-content" }}
                  className="d-flex align-items-center justify-content-between"
                >
                  <div>
                    <h6 className="my-0">Salary Summary</h6>
                    <p className="my-0">View Final Salary Summary</p>
                  </div>
                </div>
                <div
                  style={{
                    height: "fit-content",
                    position: "relative",
                  }}
                  className="my-2 rounded-2"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      rowGap: ".5rem",
                      height: "66vh",
                      width: "100%",
                      background: darkMode
                        ? "rgb(255, 255, 255)"
                        : "rgba(65, 64, 64, 0.42)",
                      color: darkMode
                        ? "var(--secondaryDashColorDark)"
                        : "var(--primaryDashMenuColor)",
                    }}
                    className="rounded-2"
                  >
                    <div className="d-flex align-items-center justify-content-center  rounded-2 flex-column gap-5">
                      <span className="d-flex align-items-center gap-2 py-1 px-3 rounded-3">
                        <span
                          className={`py-1 px-3  d-flex align-items-center gap-2 rounded-3 border ${
                            darkMode ? "bg-white" : "bg-dark"
                          }`}
                        >
                          {updates.length} Nos.
                        </span>
                        <p className="m-0">
                          Salary slips ready for distribution
                        </p>
                      </span>
                      <div
                        style={{
                          height: "25rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={PayrollSkyImage}
                          style={{ height: "100%", width: "auto" }}
                          alt="PayrollSummary"
                          className="mx-auto"
                        />
                      </div>
                      {!isPayslipSentChecked ? (
                        <button type="submit" className="btn btn-primary">
                          Send Pay Slips
                        </button>
                      ) : (
                        <Link
                          to={`/${
                            userType === 1
                              ? "admin"
                              : userType === 2
                              ? "hr"
                              : ""
                          }/Payroll_Dashboard`}
                          className="btn btn-primary"
                        >
                          Go Back to Dashboard
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`container-fluid d-flex align-items-center flex-column gap-3 justify-content-center my-2 ${
            darkMode ? "bg-light text-dark" : "bg-dark text-light"
          }`}
          style={{ height: "80vh", width: "100%" }}
        >
          <div style={{ height: "18rem", width: "auto" }}>
            <img
              style={{ height: "100%", width: "100%" }}
              src={SalaryPlaceHolder}
              alt="No Salary"
            />
          </div>
          No Salary Data Found please, Process to view.
        </div>
      )}
    </div>
  );
};

export default PayrollProcessing;
