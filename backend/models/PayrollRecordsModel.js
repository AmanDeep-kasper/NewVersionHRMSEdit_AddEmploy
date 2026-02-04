const mongoose = require("mongoose");
const fieldEncryption = require("mongoose-field-encryption").fieldEncryption;
require("dotenv").config();

const EmployeeAttendanceSchema = new mongoose.Schema(
  {
    employeeObjID: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    isAttChecked: Boolean,
    status: {
      type: String,
      enum: ["Proceed", "Hold", "Paid"],
      default: "Proceed",
    },
    FullName: String,
    departmentName: String,
    designationName: String,
    empID: String,
    doj: String,
    workLocation: String,
    PanNumber: String,
    UanNumber: String,
    BankAccount: String,
    BankIFSC: String,
    BankName: String,
    daysInMonth: { type: Number, default: 0 },
    absent: { type: Number, default: 0 },
    present: { type: Number, default: 0 },
    halfday: { type: Number, default: 0 },
    holiday: { type: Number, default: 0 },
    paidLeaves: { type: Number, default: 0 },
    unpaidLeaves: { type: Number, default: 0 },
    NCNS: { type: Number, default: 0 },
    Sandwhich: { type: Number, default: 0 },
    totalPayableDays: { type: Number, default: 0 },
    isSalaryPrepared: { type: Boolean, default: false },
    fixedBasic: { type: Number, default: 0 },
    fixedHRA: { type: Number, default: 0 },
    fixedConvenyance: { type: Number, default: 0 },
    fixedOthers: { type: Number, default: 0 },
    fixedTotalSalary: { type: Number, default: 0 },
    actualBasic: { type: Number, default: 0 },
    actualHRA: { type: Number, default: 0 },
    actualConvenyance: { type: Number, default: 0 },
    actualOthers: { type: Number, default: 0 },
    actualTotalSalary: { type: Number, default: 0 },
    bonusAmount: { type: Number, default: 0 },
    bonusType: String,
    insentiveAmount: { type: Number, default: 0 },
    insentiveType: String,
    totalBNIAdditions: { type: Number, default: 0 },
    additionComment: String,
    salaryaAfterBonusAndInsentive: { type: Number, default: 0 },
    ArrearMonth: String,
    ArrearAmountPay: { type: Number, default: 0 },
    ArrearAmountDeduct: { type: Number, default: 0 },
    SalaryAfterArrearAmt: { type: Number, default: 0 },
    arrearMessage: String,
    PFDeduction: { type: Number, default: 0 },
    ESIDedeuction: { type: Number, default: 0 },
    TDSDeduction: { type: Number, default: 0 },
    totalDeductionsAmount: { type: Number, default: 0 },
    SalaryAfterDeduction: { type: Number, default: 0 },
    deductionNotes: String,
    salaryAfterPFESIandTDS: { type: Number, default: 0 },
    reimbursmentApplied: { type: Number, default: 0 },
    reimbursmentApproved: { type: Number, default: 0 },
    reimbursmentNotes: String,
    salaryAfterReimbursment: { type: Number, default: 0 },
    advanceDuration: String,
    PreviousAdvance: { type: Number, default: 0 },
    advanceAmountPay: { type: Number, default: 0 },
    advanceAmountDeduct: { type: Number, default: 0 },
    advanceBalance: { type: Number, default: 0 },
    salaryAfterAdvance: { type: Number, default: 0 },
    ReasionForAdvance: String,
  },
  { timestamps: true }
);

// Pre-save hook to auto-calculate actual salary components
EmployeeAttendanceSchema.pre("save", function (next) {
  if (this.daysInMonth > 0 && this.totalPayableDays > 0) {
    this.actualBasic = Math.round(
      (this.fixedBasic / this.daysInMonth) * this.totalPayableDays
    );
    this.actualHRA = Math.round(
      (this.fixedHRA / this.daysInMonth) * this.totalPayableDays
    );
    this.actualConvenyance = Math.round(
      (this.fixedConvenyance / this.daysInMonth) * this.totalPayableDays
    );
    this.actualOthers = Math.round(
      (this.fixedOthers / this.daysInMonth) * this.totalPayableDays
    );
    this.actualTotalSalary = Math.round(
      this.actualBasic +
      this.actualHRA +
      this.actualConvenyance +
      this.actualOthers
    );
  }

  next();
});

EmployeeAttendanceSchema.pre("findOneAndUpdate", function (next) {
  let update = this.getUpdate();

  // Fetch the existing document before update
  this.model.findOne(this.getQuery()).then((existingDoc) => {
    if (!existingDoc) return next();

    // Ensure values exist in the update object, otherwise take from existing doc
    update.bonusAmount = update.bonusAmount ?? existingDoc.bonusAmount;
    update.insentiveAmount =
      update.insentiveAmount ?? existingDoc.insentiveAmount;
    update.actualTotalSalary =
      update.actualTotalSalary ?? existingDoc.actualTotalSalary;
    update.ArrearAmountPay =
      update.ArrearAmountPay ?? existingDoc.ArrearAmountPay;
    update.ArrearAmountDeduct =
      update.ArrearAmountDeduct ?? existingDoc.ArrearAmountDeduct;
    update.PFDeduction = update.PFDeduction ?? existingDoc.PFDeduction;
    update.ESIDedeuction = update.ESIDedeuction ?? existingDoc.ESIDedeuction;
    update.TDSDeduction = update.TDSDeduction ?? existingDoc.TDSDeduction;
    update.reimbursmentApproved =
      update.reimbursmentApproved ?? existingDoc.reimbursmentApproved;
    update.PreviousAdvance =
      update.PreviousAdvance ?? existingDoc.PreviousAdvance;
    update.advanceAmountPay =
      update.advanceAmountPay ?? existingDoc.advanceAmountPay;
    update.advanceAmountDeduct =
      update.advanceAmountDeduct ?? existingDoc.advanceAmountDeduct;

    // Recalculate values
    update.totalBNIAdditions = update.bonusAmount + update.insentiveAmount;
    update.salaryaAfterBonusAndInsentive =
      update.actualTotalSalary + update.totalBNIAdditions;
    update.SalaryAfterArrearAmt =
      update.salaryaAfterBonusAndInsentive +
      update.ArrearAmountPay -
      update.ArrearAmountDeduct;

    update.advanceBalance =
      update.PreviousAdvance +
      update.advanceAmountPay -
      update.advanceAmountDeduct;
    update.salaryAfterAdvance =
      update.SalaryAfterArrearAmt +
      update.advanceAmountPay -
      update.advanceAmountDeduct;
    update.totalDeductionsAmount =
      update.PFDeduction + update.ESIDedeuction + update.TDSDeduction;
    update.salaryAfterPFESIandTDS =
      update.salaryAfterAdvance - update.totalDeductionsAmount;
    update.salaryAfterReimbursment =
      update.salaryAfterPFESIandTDS + update.reimbursmentApproved;

    this.setUpdate(update);
    next();
  });
});

const PayrollRecordsSchema = new mongoose.Schema(
  {
    years: [
      {
        year: { type: Number, required: true, min: 2000, max: 2100 },
        months: [
          {
            month: { type: Number, required: true, min: 1, max: 12 },

            status: {
              type: String,
              enum: ["Pending", "Approved", "Rejected"],
              default: "Pending",
            },
            SalaryStatus: {
              type: String,
              enum: ["created", "inprogress", "completed"],
              default: "created",
            },
            isAttandance: { type: Boolean, default: true },
            isSalary: { type: Boolean, default: false },
            isIncentivandBonus: { type: Boolean, default: false },
            isArrer: { type: Boolean, default: false },
            isDeduction: { type: Boolean, default: false },
            isReimbursment: { type: Boolean, default: false },
            isAdvance: { type: Boolean, default: false },
            isPayslip: { type: Boolean, default: false },
            isPayslipSent: { type: Boolean, default: false },
            isAttandanceChecked: { type: Boolean, default: false },
            isSalaryChecked: { type: Boolean, default: false },
            isIncentivandBonusChecked: { type: Boolean, default: false },
            isArrerChecked: { type: Boolean, default: false },
            isDeductionChecked: { type: Boolean, default: false },
            isReimbursmentChecked: { type: Boolean, default: false },
            isAdvanceChecked: { type: Boolean, default: false },
            isPayslipChecked: { type: Boolean, default: false },
            isPayslipSentChecked: { type: Boolean, default: false },
            PayrollName: {
              type: String,
              default: function () {
                const monthNames = [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ];
                return `Payroll ${monthNames[this.month - 1] || "Unknown"}`;
              },
            },
            ProcessedAt: { type: Date, default: null },
            SalaryCreatedAt: { type: Date, default: Date.now },
            EmployeeAttandanceData: [EmployeeAttendanceSchema],
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// // 🔐 Add Encryption Plugin
// EmployeeAttendanceSchema.plugin(fieldEncryption, {
//   fields: ["PanNumber", "UanNumber", "BankAccount", "BankIFSC", "totalPayableDays", "isSalaryPrepared", "fixedBasic", "fixedHRA", "fixedConvenyance", "fixedOthers", "fixedTotalSalary", "actualBasic", "actualHRA", "actualConvenyance", "actualOthers", "actualTotalSalary", "bonusAmount", "bonusType", "insentiveAmount", "totalBNIAdditions", "salaryaAfterBonusAndInsentive", "ArrearAmountPay", "ArrearAmountDeduct", "SalaryAfterArrearAmt", "PFDeduction", "ESIDedeuction", "TDSDeduction", "totalDeductionsAmount", "SalaryAfterDeduction", "salaryAfterPFESIandTDS", "reimbursmentApplied", "reimbursmentApproved", "salaryAfterReimbursment", "advanceDuration", "PreviousAdvance", "advanceAmountPay", "advanceAmountDeduct", "advanceBalance", "salaryAfterAdvance",
//   ],
//   secret: process.env.ENCRYPTION_SECRET || "fallback_32_character_secret_key",
//   saltGenerator: (secret) => secret.slice(0, 16),
// });





const PayrollRecords = mongoose.model("PayrollRecords", PayrollRecordsSchema);
module.exports = PayrollRecords;
