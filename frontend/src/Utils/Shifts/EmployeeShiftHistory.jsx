import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Spinner, Alert, Card, Form, Row, Col, Button, Badge } from "react-bootstrap";
import BASE_URL from "../../Pages/config/config";
import toast from "react-hot-toast";
import TittleHeader from "../../Pages/TittleHeader/TittleHeader";
import "./EmployeeShiftHistory.css";
import { LuMaximize, LuMinimize } from "react-icons/lu";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import api from "../../Pages/config/api";

const EmployeeShiftHistory = () => {
  const [shiftHistories, setShiftHistories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCardId, setExpandedCardId] = useState(null);
  const {darkMode} = useTheme()

  const [filters, setFilters] = useState({
    department: "",
    startDate: "",
    endDate: "",
    employeeName: "",
  });

  useEffect(() => {
    fetchShiftHistories();
  }, []);

  const handleDateChange = (field, value) => {
    if (field === "startDate" && filters.endDate && new Date(value) > new Date(filters.endDate)) {
      toast.error("Start Date cannot be greater than End Date!");
      return;
    }
    
    if (field === "endDate" && filters.startDate && new Date(value) < new Date(filters.startDate)) {
      toast.error("End Date cannot be less than Start Date!");
      return;
    }
  
    setFilters({ ...filters, [field]: value });
  };

  // ✅ Fetch Shift History with Filters
const fetchShiftHistories = async () => {
  setLoading(true);
  try {
    const params = new URLSearchParams(filters).toString();
    const res = await api.get(
      `/api/employees/shift-history?${params}`,
    );

    // Sort shifts by latest update first
    const sortedData = res.data.map((employee) => ({
      ...employee,
      shiftHistory: employee.shiftHistory.sort(
        (a, b) => new Date(b.updatedOn) - new Date(a.updatedOn)
      ),
    }));

    setShiftHistories(sortedData);
  } catch (error) {
    toast.error("No data found matching the entered name");
    console.error("❌ Error fetching shift histories:", error);
  } finally {
    setLoading(false);
  }
};


  // ✅ Toggle Expand/Minimize
  const toggleExpand = (id) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  return (
    <Container fluid>
      <div className="mb-3 d-flex align-items-center justify-content-between">
      <TittleHeader title="Employee Shift History" message="View past shift changes with filtering options" /> 
      <div className="d-flex  align-items-center gap-2">
      <Form.Control
              type="text" 
              className={`form-control ms-0 ms-md-auto rounded-2 ${darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
              }`}
              style={{ minWidth: "200px" }}
              placeholder="Search Employee Name"
              value={filters.employeeName}
              onChange={(e) => setFilters({ ...filters, employeeName: e.target.value })}
            />
            <Button variant="primary h-100 w-100 my-auto" onClick={fetchShiftHistories}>
              Filter
            </Button>
      </div>
      </div>
      
      {loading ? (
        <div className="text-center mt-3">
          <Spinner animation="border" />
        </div>
      ) : shiftHistories.length === 0 ? (
        <Alert variant="info" className="mt-3">
          No shift history available.
        </Alert>
      ) : (
        <div className="row row-gap-3">
          {shiftHistories.map((employee) => {
            const isExpanded = expandedCardId === employee._id;

            return (
              <div key={employee._id} className={`col-sm-6 col-md-4 col-lg-3 ${isExpanded ? "fullscreen-card" : ""}`}>
                <Card  style={{  color: darkMode ? "black" : "white",
        background: isExpanded ? darkMode ? "rgb(235, 228, 228)" : "rgb(27, 26, 26)" : darkMode ? "var(--SemiLight)" : "var(--SemiDark)",
        border: darkMode
          ? "1px solid rgba(223, 220, 220, 0.95)"
          : "1px solid rgba(39, 36, 36, 0.95)", cursor:'all-scroll'}} className={`h-100 shadow-sm ${isExpanded ? "expanded-card" : ""}`}>
                  <Card.Header className="d-flex justify-content-between align-items-center">
<div>
<h5 className="mb-0">
                      {employee.FirstName} {employee.LastName}   <small className="text-muted">ID: {employee.empID || "N/A"}</small> 
                                          </h5>
                                          <span style={{fontSize:".8rem"}}>
                                          Shift Updated  : {employee.shiftHistory.length + 1} times
                                          </span>
</div>
                    <span style={{cursor:'pointer'}} onClick={() => toggleExpand(employee._id)}>
                      {isExpanded ? <LuMinimize className="fs-5" /> : <LuMaximize className="fs-5" />}
                    </span>
                  </Card.Header>
                  <Card.Body className="d-flex flex-column">
                    {employee.shiftHistory.length === 0 ? (
                      <p>No shift history available.</p>
                    ) : (
                      <div className="timeline overflow-auto" style={{ maxHeight: isExpanded ? "100%" : "200px" }}>
                        {employee.shiftHistory.map((shift, index) => (
                          <div key={index} className="timeline-item mb-2">
                            <div >
                              <strong>{shift?.shift?.name || "N/A"}</strong>
                              <br />
                              <small>
                                {shift?.shift?.startTime || "N/A"} - {shift?.shift?.endTime || "N/A"}
                              </small>
                              <br />
                              <span   className={`${darkMode ? "badge-primary" : "badge-primary-dark" }`}>
                              Updated On: {new Date(shift.updatedOn).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </Container>
  );
};

export default EmployeeShiftHistory;
