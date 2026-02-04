const { Employee } = require("../models/employeeModel");
const Notice = require("../models/noticeModel");

const NoticeBoard = async (req, res) => {
    try {
        const { id } = req.params;

        // Step 1: Find the employee by ID
        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        // Step 2: Extract the array of notice IDs
        const noticeIds = employee.Notice;

        // Step 3: Find all notices that match the notice IDs
        const notices = await Notice.find({ _id: { $in: noticeIds } });

        // Step 4: For each notice, find the creator's profile and position
        const noticesWithCreatorDetails = await Promise.all(
            notices.map(async (notice) => {
                const creator = await Employee.findOne({ Email: notice.creatorMail }).populate({path: "position", select: "PositionName -_id"}).select("profile");
               
                return {
                    ...notice.toObject(),
                    creatorProfile: creator ? creator.profile : null,
                    creatorPosition: creator ? creator.position[0].PositionName : null
                };
            })
        );

        // Step 5: Send the enhanced notices as the response
     
        res.status(200).json(noticesWithCreatorDetails);

    } catch (err) {
        console.error("Error retrieving notices:", err);
        res.status(500).json({ message: "Server error" });
    }
};
const getLastNotice = async (req, res) => {
  try {
    const lastNotice = await Notice.findOne()
      .sort({ createdAt: -1 })
      .select('-__v  -attachments');  // Exclude these fields

    if (!lastNotice) {
      return res.status(404).json({
        message: "No notices found"
      });
    }

    const creator = await Employee.findOne({ 
      Email: lastNotice.creatorMail 
    })
      .populate({ path: "position", select: "PositionName -_id" })
      .select("profile position");

    // Only include creatorProfile if it exists (it's already null-safe)
    const response = {
      ...lastNotice.toObject(),  // __v, creatorMail, attachments already excluded
      creatorPosition: creator?.position?.[0]?.PositionName || null,
      ...(creator?.profile ? { creatorProfile: creator.profile } : {})
    };

    res.status(200).json(response);

  } catch (error) {
    console.error("Error fetching last notice:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};
const createNotice = async (req, res) => {
  try {
    const { notice, creator, creatorMail } = req.body;

    if (!notice || !creator || !creatorMail) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    const newNotice = new Notice({
      notice,
      creator,
      creatorMail,
      // attachments: req.file ? req.file.path : null,
    });

    await newNotice.save();

    res.status(201).json({
      success: true,
      message: "Notice created successfully",
      data: newNotice,
    });
  } catch (error) {
    console.error("Notice Create Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



module.exports = { NoticeBoard, getLastNotice , createNotice};
  
