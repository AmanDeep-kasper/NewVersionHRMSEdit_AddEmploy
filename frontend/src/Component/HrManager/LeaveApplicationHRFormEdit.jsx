import React, { useState } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import TittleHeader from "../../Pages/TittleHeader/TittleHeader";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

const LeaveApplicationHRForm = (props) => {
  const [FromDateData, setFromDateData] = useState(
    props.editData["FromDate"].slice(0, 10)
  );
  const [ToDateData, setToDateData] = useState(
    props.editData["ToDate"] === null
      ? ""
      : props.editData["ToDate"].slice(0, 10)
  );
  const [ReasonforleaveData, setReasonforleaveData] = useState(
    props.editData["Reasonforleave"]
  );

  const handleLeaveApplicationHREditUpdate = (e) => {
    e.preventDefault();
    props.onLeaveApplicationHREditUpdate(props.editData, e);
  };
  const { darkMode } = useTheme();

  return (
    <div
      style={{
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
      }}
      className="container-fluid py-2"
    >
      <h5></h5>
      <TittleHeader
        title={`Edit Leave Application ${props.editData["FirstName"]}  ${props.editData["LastName"]}`}
        message={"You can edit leave application here."}
      />

      <form
        className="row w-100 my-2 row-gap-3"
        onSubmit={handleLeaveApplicationHREditUpdate}
      >
        <div className="col-12 col-md-6">
          <label>Leave Type</label>
          <div>
            <Form.Control
              disabled
              className={`form-select ms-0 ms-md-auto rounded-2 ${darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
              }`}
              as="select"
            >
              <option value="" selected>
                {props.editData["Leavetype"]}
              </option>
            </Form.Control>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <label>FromDate</label>
          <div>
            <Form.Control
              className={`form-control ms-0 ms-md-auto rounded-2 ${darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
              }`}
              type="date"
              required
              disabled
              value={FromDateData}
            />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <label>ToDate</label>
          <div>
            <Form.Control
               className={`form-control ms-0 ms-md-auto rounded-2 ${darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
              }`}
              type="date"
              required
              disabled
              value={ToDateData}
            />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <label>Leave Status</label>
          <div>
            <Form.Control
               className={`form-select ms-0 ms-md-auto rounded-2 ${darkMode
                ? "bg-light text-dark border dark-placeholder"
                : "bg-dark text-light border-0 light-placeholder"
              }`}
              as="select"
              required
            >
              <option value="Pending" selected disabled>
                Pending
              </option>
              <option value="2" selected={props.editData["Status"] == 2}>
                Approve
              </option>
              <option value="3" selected={props.editData["Status"] == 3}>
                Reject
              </option>
            </Form.Control>
          </div>
        </div>
        <div className="col-12">
          <label>Reason for leave</label>
          <div>
            <Form.Control
              className={`form-control ms-0 ms-md-auto rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              as="textarea"
              rows={3}
              placeholder="Reason for leave"
              required
              disabled
              value={ReasonforleaveData}
            />
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
          <button
            className="btn btn-danger"
            type="reset"
            onClick={props.onFormEditClose}
          >
            cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeaveApplicationHRForm;
