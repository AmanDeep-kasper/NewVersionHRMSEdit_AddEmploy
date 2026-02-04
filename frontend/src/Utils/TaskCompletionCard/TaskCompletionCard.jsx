import { useEffect, useState, useMemo } from "react";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import {
  CheckCircle,
  Plus,
  Layers,
  TrendingUp,
  ListChecks,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../Pages/config/api";

const SparkLine = ({ data = [], color }) => {
  if (data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);

  const points = data
    .map((val, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - ((val - min) / (max - min || 1)) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 100"
      width="100%"
      height="50"
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
};


const TaskCompletionCard = () => {
  const { darkMode } = useTheme();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [totalData, setTotalData] = useState("0 / 0");

  /* ================= FETCH DATA ================= */
  const fetchData = async (department) => {
    setLoading(true);

    const { data } = await api.get(
      `/api/tasks/ui/completion?department=${department}`,
    );

    setTasks(data);

    const completed = data.filter((t) => t.status === "Completed");
    const percentage =
      data.length > 0 ? Math.round((completed.length / data.length) * 100) : 0;

    setCompletionPercentage(percentage);
    setTotalData(`${completed.length} / ${data.length}`);
    setLoading(false);
  };

  useEffect(() => {
    fetchData("All");
  }, []);

  useEffect(() => {
    fetchData(selectedDepartment);
  }, [selectedDepartment]);

  const departmentOptions = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.department))),
    [tasks],
  );

  const completedCount = tasks.filter((t) => t.status === "Completed").length;
  const pendingCount = tasks.length - completedCount;

  const trendData = useMemo(
    () => [28, 35, 48, 52, completionPercentage],
    [completionPercentage],
  );

  if (loading) {
    return (
      <div className="rounded-4 p-4 text-center text-muted">
        Loading metrics…
      </div>
    );
  }

  return (
    <div
      className="rounded-4 shadow-sm p-4 d-flex flex-column gap-3"
      style={{
        height: "17rem",
        background: darkMode ? "#F9FAFB" : "#0F172A",
        border: darkMode ? "1px solid #E5E7EB" : "1px solid #1E293B",
        color: darkMode ? "#0F172A" : "#E5E7EB",
      }}
    >
      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2 fw-semibold">
          <Layers size={18} className="text-primary" />
          <span>Task Completion Overview</span>
        </div>

        <div className="d-flex align-items-center gap-3 ">
          <div className="d-flex align-items-center justify-content-between mt-auto">
            <div className="d-flex align-items-center gap-2">
              <select
                className={`form-select form-select-sm ${
                  darkMode ? "bg-light" : "bg-dark text-light"
                }`}
                style={{ minWidth: "40px" }}
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="All">All Departments</option>
                {departmentOptions.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Link
            to="/admin/task"
            className="btn btn-outline-primary btn-sm rounded-pill d-flex align-items-center gap-1"
          >
            <Plus size={16} /> Add Task
          </Link>
        </div>
      </div>

      {/* ================= KPI ================= */}

      {/* ================= SECONDARY STATS ================= */}
      <div className="d-flex mt-3 justify-content-between align-items-center">
        <div className="d-flex gap-4  text-center flex-1">
          <div className="col-4">
            <ListChecks size={18} className="mb-1 text-primary" />
            <div className="fw-semibold">{tasks.length}</div>
            <div className="small text-muted">Total</div>
          </div>

          <div className="col-4">
            <CheckCircle size={18} className="mb-1 text-success" />
            <div className="fw-semibold">{completedCount}</div>
            <div className="small text-muted">Completed</div>
          </div>

          <div className="col-4">
            <Clock size={18} className="mb-1 text-warning" />
            <div className="fw-semibold">{pendingCount}</div>
            <div className="small text-muted">Pending</div>
          </div>
        </div>

        <div className="flex-1">
          <div style={{ height: "60px", width: "100px" }}>
            <SparkLine
              data={trendData}
              color={darkMode ? "#2563EB" : "#60A5FA"}
            />
          </div>

          <div className="d-flex align-items-center gap-1 text-muted small mt-0">
            <TrendingUp size={14} />
            Completion Trend
          </div>
        </div>
      </div>

      <div>
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="text-muted small">Completion Rate</span>
          <span className="fw-semibold">{completionPercentage}%</span>
        </div>

        {/* Progress Bar */}
        <div
          className="progress"
          style={{
            height: "8px",
            background: darkMode ? "#E5E7EB" : "#1E293B",
          }}
        >
          <div
            className="progress-bar bg-primary"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        <div className="small text-muted mt-1">{totalData} tasks completed</div>
      </div>
    </div>
  );
};

export default TaskCompletionCard;
