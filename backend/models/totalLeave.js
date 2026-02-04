const mongoose = require("mongoose");

const totalLeaveSchema = new mongoose.Schema({
    sickLeave: { type: Number, required: true },
    totalSickLeave: { type: Number, required: true },
    paidLeave: { type: Number, required: true },
    totalPaidLeave: { type: Number, required: true },
    totalCasualLeave: { type: Number, required: true },
    totalPaternityLeave: { type: Number, required: true },
    totalMaternityLeave: { type: Number, required: true },
    casualLeave: { type: Number, required: true },
    paternityLeave: { type: Number, required: true },
    maternityLeave: { type: Number, required: true },
    empID: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
});

const TotalLeave = mongoose.model("TotalLeave", totalLeaveSchema);

module.exports = {
    TotalLeave
};
