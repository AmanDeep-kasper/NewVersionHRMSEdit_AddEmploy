import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { statusOf } from "../utils/timeFormatting";

export default function AttendanceHeader() {
  const { darkMode } = useTheme();
  const today = new Date();

  return (
    <div>
      <h5
        style={{
          color: darkMode
            ? "var(--secondaryDashColorDark)"
            : "var(--primaryDashMenuColor)",
        }}
        className="my-auto"
      >
        Today's Attendance
      </h5>
      <span className="p-0 fs-6 d-flex">
        <span
          style={{
            color: darkMode
              ? "var(--secondaryDashColorDark)"
              : "var(--primaryDashMenuColor)",
          }}
        >
          {statusOf(today)} ,{" "}
          {today.toLocaleDateString("en-GB" /* dd/mm/yyyy */)}
        </span>
      </span>
    </div>
  );
}
