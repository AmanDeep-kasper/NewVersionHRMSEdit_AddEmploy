import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./FamilyInfoTable.css";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { RingLoader } from "react-spinners";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import OverLayToolTip from "../../../Utils/OverLayToolTip";
import { useSelector } from "react-redux";
import { rowBodyStyle, rowHeadStyle } from "../../../Style/TableStyle";
import { useLocation } from "react-router-dom";
import BASE_URL from "../../../Pages/config/config";
import SearchLight from "../../../img/Attendance/SearchLight.svg";
import { FaRegEdit } from "react-icons/fa";
import api from "../../../Pages/config/api";

const FamilyInfoTable = ({ onAddFamilyInfo, onEditFamilyInfo }) => {
  const { userData } = useSelector((state) => state.user);
  const { darkMode } = useTheme();

  const location = useLocation().pathname.split("/")[2];
  const id =
    location === "employee"
      ? sessionStorage.getItem("personal_id")
      : userData?._id;

  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const isFetched = useRef(false);

  const loadFamilyInfoData = () => {
    setLoading(true);
    api
      .get(`/api/family-info/${id}`,
       )
      .then((response) => {
        setRowData(response.data.familyInfo);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Error loading family info:",
          error.response?.data || error
        );
        setLoading(false);
      });
  };

  const onFamilyInfoDelete = (familyId, memberId) => {
    if (window.confirm("Are you sure to delete this record?")) {
      api
        .delete(`/api/family-info/${familyId}/${memberId}`, 
        )
        .then(() => {
          setRowData((prev) => prev.filter((item) => item._id !== memberId));
        })
        .catch((error) => console.error("Error deleting family info:", error));
    }
  };

  useEffect(() => {
    if (!isFetched.current) {
      loadFamilyInfoData();
      isFetched.current = true;
    }
  }, []);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between mb-2">
        <TittleHeader
          title={"Family Details"}
          numbers={rowData.length}
          message={"You can view family details here."}
        />
        <button
          className="btn btn-primary my-auto d-flex align-items-center gap-2"
          onClick={onAddFamilyInfo}
        >
          <FaPlus />
          <span className="d-none d-md-flex ">Add Member</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center mt-4">
          <RingLoader size={50} color={"#0000ff"} loading={true} />
        </div>
      ) : rowData.length > 0 ? (
        <div
          className="scroller mb-2 rounded-2"
          style={{ maxHeight: "70vh", overflow: "auto" }}
        >
          <table className="table table-hover">
            <thead>
              <tr>
                <th style={rowHeadStyle(darkMode)}>Name</th>
                <th style={rowHeadStyle(darkMode)}>Relationship</th>
                <th style={rowHeadStyle(darkMode)}>DOB</th>
                <th style={rowHeadStyle(darkMode)}>Contact</th>
                <th style={rowHeadStyle(darkMode)}>Occupation</th>
                <th style={rowHeadStyle(darkMode)} className="text-end">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {rowData.map((item, index) => (
                <tr key={index}>
                  <td
                    style={rowBodyStyle(darkMode)}
                    className="text-capitalize"
                  >
                    {item.Name}
                  </td>
                  <td
                    style={rowBodyStyle(darkMode)}
                    className="text-capitalize"
                  >
                    {item.Relationship}
                  </td>
                  <td style={rowBodyStyle(darkMode)}>
                    {item.DOB?.slice(0, 10) || "N/A"}
                  </td>
                  <td style={rowBodyStyle(darkMode)}>
                    {item.parentMobile || "N/A"}
                  </td>
                  <td style={rowBodyStyle(darkMode)}>
                    {item.Occupation || "N/A"}
                  </td>
                  <td style={rowBodyStyle(darkMode)} className="text-end">
                    <OverLayToolTip
                      onClick={() => onEditFamilyInfo(item)}
                      tooltip="Edit"
                      icon={<FaRegEdit className="text-primary fs-5" />}
                    />
                    <OverLayToolTip
                      onClick={() => onFamilyInfoDelete(id, item._id)}
                      tooltip="Delete"
                      icon={<FaTrash className="text-danger fs-6" />}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          className="d-flex flex-column align-items-center justify-content-center text-center"
          style={{
            height: "65vh",
            gap: "20px",
            padding: "0 24px",
          }}
        >
          <img
            src={SearchLight}
            alt="No members available"
            style={{
              width: "160px",
              maxWidth: "80%",
              opacity: 0.9,
            }}
          />

          <div>
            <div
              style={{
                fontSize: "17px",
                fontWeight: 600,
                marginBottom: "6px",
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--primaryDashMenuColor)",
              }}
            >
              No Members Found
            </div>

            <div
              style={{
                fontSize: "14px",
                lineHeight: 1.6,
                opacity: 0.85,
                maxWidth: "420px",
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--primaryDashMenuColor)",
              }}
            >
              Member details are currently unavailable. Please add a member to
              view and manage their information here.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyInfoTable;
