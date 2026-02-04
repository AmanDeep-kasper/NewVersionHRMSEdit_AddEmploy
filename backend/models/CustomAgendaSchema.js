const mongoose = require("mongoose");

const CustomAgendaSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true }, 
        type: { 
            type: String, 
            enum: ["Reminder", "Meeting",], 
            required: true 
        },
        status: { 
            type: String, 
            enum: ["Created", "Pending", "Approved", "Rejected"], 
            default: "Created" 
        },
    },
    { timestamps: true } 
);


module.exports = mongoose.model("CustomAgenda", CustomAgendaSchema);
