import React from "react";
import PropTypes from "prop-types";

const AttendanceLegend = ({ darkMode }) => (
  <div className="pt-3 d-flex flex-column gap-2">
    <h6
      style={{
        textAlign: "start",
        color: darkMode
          ? "var(--secondaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
        fontWeight: "normal",
        fontSize: ".9rem",
      }}
      className="my-auto"
    >
      Abbreviation
    </h6>
    <div
      style={{
        height: "fit-content",
        width: "100%",
        overflow: "auto",
        padding: "0",
        margin: "0",
        borderRadius: ".5rem",
      }}
    >
      <table
        className="table p-0 m-0 table-bordered table-striped"
        style={{
          textAlign: "start",
          color: darkMode
            ? "var(--secondaryDashColorDark)"
            : "var(--secondaryDashMenuColor)",
          fontWeight: "normal",
          fontSize: ".9rem",
        }}
      >
        <tbody>
          <tr>
            <td
              className="border"
              style={{
                textAlign: "center",
                whiteSpace: "pre",
                backgroundColor: darkMode
                  ? "rgba(231, 18, 18, 0.93)"
                  : "rgba(231, 18, 18, 0.38)",
                color: "white",
              }}
            >
              Absent
            </td>
            <td
              className="border"
              style={{
                textAlign: "center",
                whiteSpace: "pre",
                backgroundColor: darkMode
                  ? "rgb(26, 188, 156)"
                  : "rgba(26, 188, 156, 0.64)",
                color: "white",
              }}
            >
              Present
            </td>
            <td
              className="border"
              style={{
                textAlign: "center",
                whiteSpace: "pre",
                background: darkMode
                  ? "rgb(93, 173, 226)"
                  : "rgba(170, 211, 238, 0.55)",
                color: "white",
              }}
            >
              Late
            </td>
            <td
              className="border"
              style={{
                textAlign: "center",
                whiteSpace: "pre",
                backgroundColor: darkMode
                  ? "rgb(243, 156, 18)"
                  : "rgba(243, 157, 18, 0.73)",
                color: "white",
              }}
            >
              Halfday
            </td>
            <td
              className="border"
              style={{
                textAlign: "center",
                whiteSpace: "pre",
                background: darkMode
                  ? "rgb(155, 89, 182)"
                  : "rgba(201, 117, 235, 0.32)",
                color: "white",
              }}
            >
              Week Off
            </td>
            <td
              className="border"
              style={{
                textAlign: "center",
                whiteSpace: "pre",
                background: darkMode
                  ? "rgba(3, 201, 136,1)"
                  : "rgba(3, 201, 136,.5)",
                color: "white",
              }}
            >
              Paid Full
            </td>
            <td
              className="border"
              style={{
                textAlign: "center",
                whiteSpace: "pre",
                background: darkMode
                  ? "rgba(133, 169, 71,1)"
                  : "rgba(73, 107, 15, 0.66)",
                color: "white",
              }}
            >
              Paid Half
            </td>
            <td
              className="border"
              style={{
                textAlign: "center",
                whiteSpace: "pre",
                background: darkMode
                  ? "rgba(175, 23, 64, 1)"
                  : "rgba(175, 23, 64, .5)",
                color: "white",
              }}
            >
              Unpaid Full
            </td>
            <td
              className="border"
              style={{
                textAlign: "center",
                whiteSpace: "pre",
                background: darkMode
                  ? "rgba(222, 124, 125, 1)"
                  : "rgba(222, 124, 125, .5)",
                color: "white",
              }}
            >
              Unpaid Half
            </td>
            <td
              className="border"
              style={{
                textAlign: "center",
                whiteSpace: "pre",
                backgroundColor: darkMode
                  ? "rgb(63, 157, 233)"
                  : "rgba(72, 152, 218, 0.66)",
                color: "white",
              }}
            >
              Holiday
            </td>
            <td
              className="border"
              style={{
                textAlign: "center",
                whiteSpace: "pre",
                backgroundColor: darkMode
                  ? "rgb(244, 208, 63)"
                  : "rgba(244, 208, 63, 0.67)",
                color: "white",
              }}
            >
              Sandwhich
            </td>
             <td
              className="border"
              style={{
                textAlign: "center",
                whiteSpace: "pre",
                backgroundColor: darkMode
                  ? "rgba(231, 18, 18, 0.93)"
                  : "rgba(231, 18, 18, 0.38)",
                color: "white",
              }}
            >
              Forced Absent
            </td>
            <td
              className="border"
              style={{
                textAlign: "center",
                whiteSpace: "pre",
                backgroundColor: darkMode
                  ? "rgba(255, 0, 0, 0.99)"
                  : "rgba(255, 0, 0, 0.73)",
                color: "white",
              }}
            >
              NCNS
            </td>
          </tr>
          <tr>
            <td
              className="px-3 border"
              style={{
                backgroundColor: darkMode
                  ? "rgba(231, 18, 18, 0.93)"
                  : "rgba(231, 18, 18, 0.38)",
                color: "white",
                textAlign: "center",
              }}
            >
              A
            </td>
            <td
              className="px-3 border"
              style={{
                backgroundColor: darkMode
                  ? "rgb(26, 188, 156)"
                  : "rgba(26, 188, 156, 0.64)",
                color: "white",
                textAlign: "center",
              }}
            >
              P
            </td>
            <td
              className="px-3 border"
              style={{
                background: darkMode
                  ? "rgb(93, 173, 226)"
                  : "rgba(170, 211, 238, 0.55)",
                color: "white",
                textAlign: "center",
              }}
            >
              L
            </td>
            <td
              className="px-3 border"
              style={{
                backgroundColor: darkMode
                  ? "rgb(243, 156, 18)"
                  : "rgba(243, 157, 18, 0.73)",
                color: "white",
                textAlign: "center",
              }}
            >
              H
            </td>
            <td
              className="px-3 border"
              style={{
                background: darkMode
                  ? "rgb(155, 89, 182)"
                  : "rgba(201, 117, 235, 0.32)",
                color: "white",
                textAlign: "center",
              }}
            >
              W
            </td>
            <td
              className="px-3 border"
              style={{
                background: darkMode
                  ? "rgba(3, 201, 136,1)"
                  : "rgba(3, 201, 136,.5)",
                color: "white",
                textAlign: "center",
              }}
            >
              VF
            </td>
            <td
              className="px-3 border"
              style={{
                background: darkMode
                  ? "rgba(133, 169, 71,1)"
                  : "rgba(73, 107, 15, 0.66)",
                color: "white",
                textAlign: "center",
              }}
            >
              VH
            </td>
            <td
              className="px-3 border"
              style={{
                background: darkMode
                  ? "rgba(175, 23, 64, 1)"
                  : "rgba(175, 23, 64, .5)",
                color: "white",
                textAlign: "center",
              }}
            >
              UF
            </td>
            <td
              className="px-3 border"
              style={{
                background: darkMode
                  ? "rgba(222, 124, 125, 1)"
                  : "rgba(222, 124, 125, .5)",
                color: "white",
                textAlign: "center",
              }}
            >
              UH
            </td>
            <td
              className="px-3 border"
              style={{
                backgroundColor: darkMode
                  ? "rgb(63, 157, 233)"
                  : "rgba(72, 152, 218, 0.66)",
                color: "white",
                textAlign: "center",
              }}
            >
              O
            </td>
            <td
              className="px-3 border"
              style={{
                backgroundColor: darkMode
                  ? "rgb(244, 208, 63)"
                  : "rgba(244, 208, 63, 0.67)",
                color: "white",
                textAlign: "center",
              }}
            >
              S
            </td>
            <td
              className="px-3 border"
              style={{
                backgroundColor: darkMode
                  ? "rgba(255, 0, 0, 0.99)"
                  : "rgba(255, 0, 0, 0.73)",
                color: "white",
                textAlign: "center",
              }}
            >
              FA
            </td>
            <td
              className="px-3 border"
              style={{
                backgroundColor: darkMode
                  ? "rgba(255, 0, 0, 0.99)"
                  : "rgba(255, 0, 0, 0.73)",
                color: "white",
                textAlign: "center",
              }}
            >
              N
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      style={{
        textAlign: "start",
        color: darkMode
          ? "var(--secondaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
        fontWeight: "normal",
        fontSize: ".9rem",
      }}
      className="py-3"
    >
      <h6>Notes</h6>
      <p style={{ fontSize: ".9rem" }} className="m-0 p-0">
        Weekly off ( W ) is considered part of an employee's present status,
        meaning it is not deducted from their attendance.
      </p>
      <p style={{ fontSize: ".9rem" }} className="m-0 p-0">
        Being late mark ( L ) is used to identify whether employees are
        arriving on time, but it is still counted as part of their present
        status.
      </p>
    </div>
  </div>
);

AttendanceLegend.propTypes = {
  darkMode: PropTypes.bool.isRequired,
};

export default AttendanceLegend;