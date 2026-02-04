import React, { useState } from "react";
import { useDispatch, useSelector } from "../../redux/store";
import { addMarketingReport } from "../../redux/slices/marketingReportSlice";
import toast from "react-hot-toast";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const AddDailyReport = ({ onClick }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.marketingReports);
  const { userData } = useSelector((state) => state.user);
  const { darkMode } = useTheme();

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    user: userData._id,
    domain: "",
    datePosted: getTodayDate(),
    liveUrl: "",
    anchorTag: "",
    title: "",
    description: "",
    targetedPage: "",
    da: "",
    pa: "",
    ss: "",
    backLinkType: "",
    statusType: "",
    remarks: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addMarketingReport(formData))
      .unwrap()
      .then(() => {
        toast.success("Marketing report added successfully!");
        setFormData({
          user: userData._id,
          domain: "",
          datePosted: "",
          liveUrl: "",
          anchorTag: "",
          title: "",
          description: "",
          targetedPage: "",
          da: "",
          pa: "",
          ss: "",
          backLinkType: "",
          statusType: "",
          remarks: "",
        });
      })
      .catch((err) => {
        // Check if `err` contains a specific message
        const errorMessage =
          err.message || (err.error ? err.error : "An unknown error occurred");
        toast.error(`${errorMessage}`);
      });
  };

  return (
    <div>
      <form className="row row-gap-2" onSubmit={handleSubmit}>
        <div className="form-group col-12 col-md-6">
          <label>
            Domain <sup className="text-danger">*</sup>
          </label>
          <input
            type="url"
            className={`form-control rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            name="domain"
            value={formData.domain}
            onChange={handleChange}
            placeholder="Enter the domain name"
            required
          />
        </div>
        {/* Date Posted */}
        <div className="form-group col-12 col-md-6">
          <label>
            Date Posted <sup className="text-danger">*</sup>
          </label>
          <input
            type="date"
            className={`form-control rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            name="datePosted"
            value={formData.datePosted}
            onChange={handleChange}
            required
          />
        </div>
        {/* Live URL */}
        <div className="form-group col-12 col-md-6">
          <label>
            Live URL <sup className="text-danger">*</sup>
          </label>
          <input
            type="url"
            className={`form-control rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            name="liveUrl"
            value={formData.liveUrl}
            onChange={(e) => {
              const updatedValue = e.target.value.replace(/\s+/g, "");
              handleChange({
                target: { name: e.target.name, value: updatedValue },
              });
            }}
            placeholder="Enter the live URL"
            required
          />
        </div>
        {/* Anchor Tag */}
        <div className="form-group col-12 col-md-6">
          <label>Anchor Tag</label>
          <input
            type="text"
            className={`form-control rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            name="anchorTag"
            value={formData.anchorTag}
            onChange={(e) => {
              const sanitizedValue = e.target.value.replace(
                /[^a-zA-Z0-9 ]/g,
                " "
              );

              handleChange({
                target: { name: e.target.name, value: sanitizedValue },
              });
            }}
            placeholder="Enter the anchor tag text"
          />
        </div>
        {/* Title */}
        <div className="form-group col-12 col-md-6">
          <label>
            Title <sup className="text-danger">*</sup>
          </label>
          <input
            type="text"
            className={`form-control rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter the title of the content"
            required
          />
        </div>
        {/* Description */}
        <div className="form-group col-12 col-md-6">
          <label>
            Description <sup className="text-danger">*</sup>
          </label>
          <input
            type="text"
            className={`form-control rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter a brief description of the content"
            required
          />
        </div>
        {/* Targeted Page */}
        <div className="form-group col-12 col-md-6">
          <label>Targeted Page</label>
          <input
            type="text"
            className={`form-control rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            name="targetedPage"
            value={formData.targetedPage}
            onChange={handleChange}
            placeholder="Enter the targeted page or URL"
          />
        </div>
        {/* DA (Domain Authority) */}
        <div className="form-group col-12 col-md-6">
          <label>
            DA (Domain Authority) <sup className="text-danger">*</sup>
          </label>
          <input
            type="text"
            className={`form-control rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            name="da"
            maxLength={3}
            value={formData.da}
            onChange={(e) => {
              const NumberVal = e.target.value.replace(/[^0-9]/g, "");
              handleChange({
                target: { name: e.target.name, value: NumberVal },
              });
            }}
            placeholder="Enter the Domain Authority score"
            required
          />
        </div>
        {/* PA (Page Authority) */}
        <div className="form-group col-12 col-md-6">
          <label>
            PA (Page Authority) <sup className="text-danger">*</sup>
          </label>
          <input
            type="text"
            className={`form-control rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            name="pa"
            maxLength={3}
            value={formData.pa}
            onChange={(e) => {
              const NumberVal = e.target.value.replace(/[^0-9]/g, "");
              handleChange({
                target: { name: e.target.name, value: NumberVal },
              });
            }}
            placeholder="Enter the Page Authority score"
            required
          />
        </div>
        {/* SS (Spam Score) */}
        <div className="form-group col-12 col-md-6">
          <label>
            SS (Spam Score) % <sup className="text-danger">*</sup>
          </label>
          <input
            type="text"
            className={`form-control rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            name="ss"
            maxLength={3}
            value={formData.ss}
            onChange={(e) => {
              const NumberVal = e.target.value.replace(/[^0-9]/g, "");
              handleChange({
                target: { name: e.target.name, value: NumberVal },
              });
            }}
            placeholder="Enter the Social Shares count"
            required
          />
        </div>
        {/* Backlink Type */}
        <div className="form-group d-flex flex-column col-12 col-md-6">
          <label>
            Backlink Type <sup className="text-danger">*</sup>
          </label>
          <select
            name="backLinkType"
            value={formData.backLinkType}
            onChange={handleChange}
            required
            className={`form-select rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            id=""
          >
            <option value="" disabled hidden>
              -- Select Backlink Type --
            </option>
            <option value="Blog Posting">Blog Posting</option>
            <option value="Social Bookmarking">Social Bookmarking</option>
            <option value="Forum submission">Forum submission</option>
            <option value="Image Submission">Image Submission</option>
            <option value="Profile Submission">Profile Submission</option>
            <option value="Community Submission">Community submission</option>
            <option value="Classified Submission">Classified Submission</option>
            <option value="Infographic Submission">
              Infographic Submission
            </option>
            <option value="Video Submission">Video Submission</option>
            <option value="Q&A Submission">Q&A Submission</option>
            <option value="Press Releas">Press Release</option>
            <option value="Blog Commenting">Blog Commenting</option>
            <option value="Guest Posting">Guest Posting</option>
          </select>
        </div>
        {/* Status Type */}
        <div className="form-group col-12 col-md-6">
          <label>
            Status Type <sup className="text-danger">*</sup>
          </label>
          <select
            className={`form-select rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            name="statusType"
            value={formData.statusType}
            onChange={handleChange}
            required
          >
            <option value="" disabled hidden>
              -- Select Status --
            </option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="form-group col-12">
          <label>Remarks</label>
          <textarea
            className={`form-control rounded-2 ${
              darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
            }`}
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            required
            placeholder="Enter any additional remarks"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary ml-3 px-4"
          style={{ width: "fit-content" }}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
        <button
          style={{ width: "fit-content" }}
          className="btn mx-3 px-4 btn-danger"
          onClick={onClick}
        >
          Cancel ( Esc Key)
        </button>
      </form>
    </div>
  );
};

export default AddDailyReport;
