const CustomAgenda = require("../models/CustomAgendaSchema");

// Create a new custom agenda
exports.createCustomAgenda = async (req, res) => {
    try {
        const { title, description, startDate, endDate, type, createdBy } = req.body;

        const newAgenda = new CustomAgenda({
            title,
            description,
            startDate,
            endDate,
            type,
            createdBy,
        });

        await newAgenda.save();
        res.status(201).json({ message: "Custom agenda created successfully", agenda: newAgenda });
    } catch (error) {
        console.error("Error creating custom agenda:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get all custom agendas
exports.getAllCustomAgendas = async (req, res) => {
    try {
        const agendas = await CustomAgenda.find().populate("createdBy", "name email");
        res.status(200).json(agendas);
    } catch (error) {
        console.error("Error fetching custom agendas:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get a single custom agenda by ID
exports.getCustomAgendaById = async (req, res) => {
    try {
        const agenda = await CustomAgenda.findById(req.params.id).populate("createdBy", "name email");
        if (!agenda) return res.status(404).json({ message: "Custom agenda not found" });
        res.status(200).json(agenda);
    } catch (error) {
        console.error("Error fetching agenda:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update a custom agenda
exports.updateCustomAgenda = async (req, res) => {
    try {
        const updatedAgenda = await CustomAgenda.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAgenda) return res.status(404).json({ message: "Agenda not found" });

        res.status(200).json({ message: "Agenda updated successfully", agenda: updatedAgenda });
    } catch (error) {
        console.error("Error updating agenda:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Delete a custom agenda
exports.deleteCustomAgenda = async (req, res) => {
    try {
        const deletedAgenda = await CustomAgenda.findByIdAndDelete(req.params.id);
        if (!deletedAgenda) return res.status(404).json({ message: "Agenda not found" });

        res.status(200).json({ message: "Agenda deleted successfully" });
    } catch (error) {
        console.error("Error deleting agenda:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
