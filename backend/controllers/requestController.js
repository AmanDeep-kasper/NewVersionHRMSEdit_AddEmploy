const mongoose = require("mongoose");
const moment = require("moment-timezone");
const { Request } = require("../models/requestModel");
const { Employee } = require("../models/employeeModel");

const createRequest = async (req, res) => {
  try {
    const { to, requestedBy, cc, subject, remark, priority } = req.body;
    const cc1 = cc.map((val) => val.value);

    // Create a new request with priority and auto-incrementing ticketID
    const currentISTTime = moment
      .tz("Asia/Kolkata")
      .format("YYYY-MM-DDTHH:mm:ss.SSSZ");

    const newRequest = new Request({
      to,
      requestedBy,
      cc: cc1,
      subject,
      remark,
      priority,
      createdAt: currentISTTime,
    });

    // Save the request and generate ticketID
    const savedRequest = await newRequest.save();

    // Find the employee and update their Request array with the new request ID
    await Employee.updateOne(
      { Email: requestedBy }, // Assuming `requestedBy` is the employee's email
      { $push: { Request: savedRequest._id } }
    );

    res.status(201).json({
      message: "Request created and employee updated successfully",
      savedRequest,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating request", error });
  }
};

const AllRequest = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Query the database for requests where email is either in 'to' or 'cc' array
    const requests = await Request.find({
      $or: [{ to: email }, { cc: { $in: [email] } }],
    });

    // This function replaces email addresses with employee details
    async function replaceEmailWithDetails(tickets) {
      return Promise.all(
        tickets.map(async (ticket) => {
          const toDetails = await getEmployeeDetailsByEmail(ticket.to);
          const requestedByDetails = await getEmployeeDetailsByEmail(
            ticket.requestedBy
          );

          // Update cc if exists
          const ccDetails = await Promise.all(
            ticket.cc.map((email) => getEmployeeDetailsByEmail(email))
          );

          return {
            ...ticket.toObject(), // Convert Mongoose document to plain object
            to: toDetails,
            requestedBy: requestedByDetails,
            cc: ccDetails,
          };
        })
      );
    }

    // Fetching employee details by email
    async function getEmployeeDetailsByEmail(email) {
      // Replace with actual API call to fetch employee details from the employee module
      const employee = await Employee.findOne({ Email: email }).select(
        "profile FirstName LastName Account"
      );
      return {
        email: email,
        firstName: employee?.FirstName || "N/A",
        lastName: employee?.LastName || "N/A",
        Account: employee?.Account || "N/A",
        profilePhoto: employee?.profile ? employee.profile.image_url : null,
      };
    }

    // Get updated tickets with employee details
    const updatedTickets = await replaceEmailWithDetails(requests);

    // Send the requests back to the client
    res.status(200).json(updatedTickets);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const AllRequestRaised = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Query the database for requests raised by the user
    const requests = await Request.find({ requestedBy: email });
    async function replaceEmailWithDetails(tickets) {
      return Promise.all(
        tickets.map(async (ticket) => {
          const toDetails = await getEmployeeDetailsByEmail(ticket.to);
          const requestedByDetails = await getEmployeeDetailsByEmail(
            ticket.requestedBy
          );

          // Update cc if exists
          const ccDetails = await Promise.all(
            ticket.cc.map((email) => getEmployeeDetailsByEmail(email))
          );

          return {
            ...ticket.toObject(), // Convert Mongoose document to plain object
            to: toDetails,
            requestedBy: requestedByDetails,
            cc: ccDetails,
          };
        })
      );
    }

    // Fetching employee details by email
    async function getEmployeeDetailsByEmail(email) {
      // Replace with actual API call to fetch employee details from the employee module
      const employee = await Employee.findOne({ Email: email }).select(
        "profile"
      );
      return {
        email: email,
        firstName: employee?.FirstName || "N/A",
        lastName: employee?.LastName || "N/A",
        profilePhoto: employee?.profile ? employee.profile.image_url : null,
      };
    }

    // Get updated tickets with employee details
    const updatedTickets = await replaceEmailWithDetails(requests);

    // Send the requests back to the client
    res.status(200).json(updatedTickets);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateRequestStatus = async (req, res) => {
  try {
    const { id, remark, updatedBy, status } = req.body;
    console.log(status);

    // Validate id, remark, updatedBy, and status
    if (!id || !remark || !updatedBy || !status) {
      return res
        .status(400)
        .json({ error: "id, remark, updatedBy, and status are required" });
    }

    // Find the existing request by ID
    const existingRequest = await Request.findById(id);

    // Check if the request was found
    if (!existingRequest) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Compare the current status with the new status
    if (existingRequest.status === status) {
      return res.status(406).json({
        message: "No update needed, the status is already up to date.",
      });
    }

    // Get the current time in IST
    const currentISTTime = moment.tz("Asia/Kolkata");
    console.log(existingRequest.reOpen.slice(-1)[0]?.updatedAt);

    // Check if the last update time is more than 72 hours ago
    const lastUpdatedAt = moment(
      existingRequest.reOpen.slice(-1)[0]?.updatedAt
    ); // assuming reOpen array stores the last update
    const timeDifference = currentISTTime.diff(lastUpdatedAt, "hours");

    if (timeDifference > 72) {
      return res.status(406).json({
        message: "Time difference is more than 72 hours. No update needed.",
      });
    }

    // Update the request with the new status and add to reOpen array
    const updatedRequest = await Request.findByIdAndUpdate(
      id,
      {
        $set: { status: status },
        $push: {
          reOpen: {
            remark,
            updatedBy,
            updatedAt: currentISTTime.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          },
        },
      },
      { new: true } // Return the updated document
    );

    res.status(200).json({
      message: "Request status updated and reOpen array modified successfully",
      updatedRequest,
    });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Shashi 
const getRequestProfiles = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // 1️⃣ Get only tickets related to this user
    const requests = await Request.find(
      {
        status: "Pending",
        $or: [{ to: email }, { cc: email }, { requestedBy: email }],
      },
      {
        to: 1,
        requestedBy: 1,
        ticketID: 1,
        priority: 1,
        status: 1,
        createdAt: 1,
      }
    ).sort({ createdAt: -1 });

    if (!requests.length) return res.json([]);

    // 2️⃣ Collect all unique emails
    const emails = [...new Set(requests.flatMap((r) => [r.to, r.requestedBy]))];

    // 3️⃣ Fetch only profile info from Employee
    const employees = await Employee.find(
      { Email: { $in: emails } },
      { FirstName: 1, LastName: 1, Email: 1, profile: 1 }
    );

    // 4️⃣ Create lookup map
    const employeeMap = {};
    employees.forEach((emp) => {
      employeeMap[emp.Email] = {
        name: `${emp.FirstName || ""} ${emp.LastName || ""}`.trim(),
        email: emp.Email,
        profilePhoto: emp.profile?.image_url || null,
      };
    });

    // 5️⃣ Build final clean response
    const response = requests.map((r) => ({
      ticketID: r.ticketID,
      createdAt: r.createdAt,
      priority: r.priority,
      status: r.status,

      profile: employeeMap[r.requestedBy] || {
        name: "Unknown",
        email: r.requestedBy,
        profilePhoto: null,
      },
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error("Request Profile Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createRequest,
  AllRequest,
  updateRequestStatus,
  AllRequestRaised,
  getRequestProfiles,
};
