import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import toast from "react-hot-toast";
import "./NoticeManagement.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../../Pages/config/api";
import RichTextEditor from "../../../Utils/TextEditor/RichTextEditor";

const NoticeManagement = () => {
  const { userData } = useSelector((state) => state.user);
  const email = userData?.Email;
  const name = `${userData?.FirstName} ${userData?.LastName}`;
  const route = useLocation().pathname.split("/")[1];
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [notice, setNotice] = useState("");
  const [attachments, setAttachments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isFormValid = () => {
    return notice.replace(/<[^>]*>/g, "").trim().length > 0;
  };

  const sendNotice = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setError("Notice content is required.");
      return;
    }

    const formData = new FormData();
    formData.append("noticeId", uuid());
    formData.append("notice", notice);
    formData.append("file", attachments);
    formData.append("creator", name);
    formData.append("creatorMail", email);

    setLoading(true);

    try {
      await api.post("/api/notice", formData);
      toast.success("Notice sent successfully!");
      navigate(`/${route}/NoticeBoard`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send notice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid py-2"
      style={{
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
        height: "95vh",
      }}
    >
      <TittleHeader
        title="Send New Notice"
        message="Create notice or announcement from here."
      />

      <form onSubmit={sendNotice} className="mt-3 d-flex flex-column gap-3">
        <div>
          <label className="mb-1">Notice</label>

          <RichTextEditor
            value={notice}
            onChange={(val) => {
              setNotice(val);
              setError("");
            }}
            darkMode={darkMode}
          />

          {error && <small className="text-danger">{error}</small>}
        </div>

        <div>
          <label>Attachments</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setAttachments(e.target.files[0])}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-fit"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Notice"}
        </button>
      </form>
    </div>
  );
};

export default NoticeManagement;
