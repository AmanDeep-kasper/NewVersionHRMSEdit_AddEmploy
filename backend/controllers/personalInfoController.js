const Joi = require("joi");
const { Employee } = require("../models/employeeModel");
const multer = require("multer");
const {
  EmployeePersonalInfoValidation,
} = require("../validations/employeeValidation");
const { fileUploadMiddleware, checkFileSize } = require("../middleware/multer");
const {
  cloudinaryFileUploder,
  removeCloudinaryImage,
} = require("../cloudinary/cloudinaryFileUpload");
const personalInfo = async (req, res) => {
  Employee.findById(req.params.id)
    .populate({
      path: "role position department shifts",
    })
    .select("-salary -education -familyInfo -workExperience")
    .exec(function (err, employee) {
      // employee = employees;
      res.send(employee);
    });
};

// const updatepersonalInfo = async (req, res) => {
//   try {
//     // Middleware to handle file upload
//     fileUploadMiddleware(req, res, async (err) => {
//       if (err instanceof multer.MulterError) {
//         return res.status(400).send("Multer error");
//       } else if (err) {
//         return res.status(500).send("Internal server error");
//       }

//       // Handle other form fields
//       const newEmployee = {
//         BloodGroup: req.body.BloodGroup,
//         ContactNo: req.body.ContactNo,
//         DOB: req.body.DOB,
//         presonalEmail: req.body.presonalEmail,
//         EmergencyContactNo: req.body.EmergencyContactNo,
//         Gender: req.body.Gender,
//         Hobbies: req.body.Hobbies,
//         PANcardNo: req.body.PANcardNo,
//         PermanetAddress: req.body.PermanetAddress,
//         PresentAddress: req.body.PresentAddress,
       
//       };

//       // Handle file upload to Cloudinary
//       if (req.file) {
//         const cloudinaryResponse = await cloudinaryFileUploder(req.file.path);
//         newEmployee.profile = {
//           image_url: cloudinaryResponse.image_url,
//           publicId: cloudinaryResponse.publicId,
//         };
//       }

//       // Update Employee in MongoDB
//       const updatedEmployee = await Employee.findByIdAndUpdate(
//         req.params.id,
//         { $set: newEmployee },
//         { new: true }
//       );

//       // Send response
//       res.json(updatedEmployee);
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Server error");
//   }
// };
const updatepersonalInfo = async (req, res) => {
  try {
    fileUploadMiddleware(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).send("Multer error");
      } else if (err) {
        return res.status(500).send("Internal server error");
      }

      // Prepare new employee data
      const newEmployee = {
        BloodGroup: req.body.BloodGroup,
        ContactNo: req.body.ContactNo,
        DOB: req.body.DOB,
        presonalEmail: req.body.presonalEmail,
        EmergencyContactNo: req.body.EmergencyContactNo,
        Gender: req.body.Gender,
        Hobbies: req.body.Hobbies,
        PANcardNo: req.body.PANcardNo,
        PermanetAddress: req.body.PermanetAddress,
        PresentAddress: req.body.PresentAddress,
      };

      // Check if a new profile image is uploaded
      if (req.file) {
        const cloudinaryResponse = await cloudinaryFileUploder(req.file.path);
        newEmployee.profile = {
          image_url: cloudinaryResponse.image_url,
          publicId: cloudinaryResponse.publicId,
        };
      } else if (req.body.existingProfile) {
        // Retain old profile image if no new file is uploaded
        newEmployee.profile = {
          image_url: req.body.existingProfile,
        };
      }

      // Update Employee in MongoDB
      const updatedEmployee = await Employee.findByIdAndUpdate(
        req.params.id,
        { $set: newEmployee },
        { new: true }
      );

      res.json(updatedEmployee);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

module.exports = {
  personalInfo,
  updatepersonalInfo,
};
