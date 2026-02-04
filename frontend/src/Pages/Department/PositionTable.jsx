import React, { useState, useEffect } from "react";
import "./PositionTable.css";
import { RingLoader } from "react-spinners";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import Position from "../../img/Position/Position.svg";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import OverLayToolTip from "../../Utils/OverLayToolTip";
import { FiEdit2 } from "react-icons/fi";
import Pagination from "../../Utils/Pagination";
import { rowBodyStyle, rowHeadStyle } from "../../Style/TableStyle";
import api from "../config/api";

const PositionTable = ({
  updateTotalPositions,
  onAddPosition,
  onEditPosition,
}) => {
  const [positionData, setPositionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { darkMode } = useTheme();

  useEffect(() => {
    loadPositionData();
  }, []);

  const loadPositionData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/position");
      setPositionData(response.data || []);
      // updateTotalPositions?.(response.data?.length || 0);
    } catch (error) {
      console.error("Failed to load positions:", error);
    } finally {
      setLoading(false);
    }
  };

  const onPositionDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this record?")) return;

    try {
      await api.delete(`/api/position/${id}`);
      loadPositionData();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        window.alert(err.response.data);
      }
    }
  };

  /* Pagination logic */
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = positionData.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(positionData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container-fluid mb-3">
      {/* Header */}
      <div className="d-flex justify-content-between py-2">
        <div className="my-auto">
          <h5
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
              fontWeight: "600",
            }}
            className="m-0"
          >
            Position Details ({positionData.length})
          </h5>
          <p
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
            }}
            className="m-0"
          >
            You can see all position's list here
          </p>
        </div>

        <button
          className="btn btn-primary gap-1 d-flex align-items-center"
          onClick={onAddPosition}
        >
          <AiOutlinePlusCircle className="fs-4" />
          <span className="d-none d-md-flex">Create Position</span>
        </button>
      </div>

      {/* Loader */}
      {loading && (
        <div className="d-flex justify-content-center py-5">
          <RingLoader size={50} color="#0d6efd" />
        </div>
      )}

      {/* Table */}
      {!loading && positionData.length > 0 ? (
        <>
          <div
            style={{
              maxHeight: "70vh",
              overflow: "auto",
              border: darkMode ? "var(--borderLight)" : "var(--borderDark)",
            }}
            className="scroller mb-2 rounded-2"
          >
            <table className="table mb-0 table-hover">
              <thead>
                <tr>
                  <th style={rowHeadStyle(darkMode)}>S. No.</th>
                  <th style={rowHeadStyle(darkMode)}>Company</th>
                  <th style={rowHeadStyle(darkMode)}>Position</th>
                  <th style={rowHeadStyle(darkMode)} className="text-end">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentItems.map((data, index) => (
                  <tr key={data._id}>
                    <td style={rowBodyStyle(darkMode)}>
                      {indexOfFirstItem + index + 1}
                    </td>

                    <td style={rowBodyStyle(darkMode)}>
                      {data?.company?.[0]?.CompanyName || "—"}
                    </td>

                    <td
                      style={rowBodyStyle(darkMode)}
                      className="text-capitalize"
                    >
                      {data.PositionName}
                    </td>

                    <td style={rowBodyStyle(darkMode)} className="text-end">
                      <OverLayToolTip
                        icon={<FiEdit2 className="text-primary" />}
                        onClick={() => onEditPosition(data)}
                        tooltip="Edit Position"
                      />

                      <OverLayToolTip
                        icon={<AiOutlineDelete className="fs-5 text-danger" />}
                        onClick={() => onPositionDelete(data._id)}
                        tooltip="Delete Position"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            pageNumbers={pageNumbers}
            handlePaginationPrev={() =>
              setCurrentPage((p) => Math.max(p - 1, 1))
            }
            handlePaginationNext={() =>
              setCurrentPage((p) => Math.min(p + 1, pageNumbers.length))
            }
            setCurrentPage={setCurrentPage}
            filteredDataLength={positionData.length}
            itemsPerPage={itemsPerPage}
          />
        </>
      ) : (
        !loading && (
          <div
            style={{
              height: "60vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            <img src={Position} alt="No data" width="200" />
            <p
              className="text-center w-75"
              style={{
                color: darkMode
                  ? "var(--secondaryDashColorDark)"
                  : "var(--primaryDashMenuColor)",
              }}
            >
              Position not created yet. Click on “Create Position” to add one.
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default PositionTable;
