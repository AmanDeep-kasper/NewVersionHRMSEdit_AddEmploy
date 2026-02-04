import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  ClipboardList,
  Calendar,
  Flag,
  User,
  Building2,
  UploadCloud,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { useSelector } from "react-redux";
import api from "../../../Pages/config/api";
import RichTextEditor from "../../../Utils/TextEditor/RichTextEditor";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";

const TaskAssign = () => {
  const { darkMode } = useTheme();
  const { userData } = useSelector((state) => state.user);
  const currentUserId = userData?._id;

  const [departments, setDepartments] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(false);

  const [task, setTask] = useState({
    title: "",
    priority: "",
    description: "",
    startDate: "",
    dueDate: "",
    attachments: null,
    managerEmail: "",
    department: "",
  });

  const [touched, setTouched] = useState({});

  const isFormValid = () =>
    task.title.trim() &&
    task.priority &&
    task.description?.trim() &&
    task.startDate &&
    task.dueDate &&
    task.managerEmail &&
    task.department;

  useEffect(() => {
    api
      .get("/api/departmentName")
      .then((res) => setDepartments(res.data || []))
      .catch(() => toast.error("Failed to load departments"));
  }, []);

  const loadManagers = useCallback(async () => {
    if (!task.department) {
      setManagers([]);
      return;
    }

    setLoadingManagers(true);
    try {
      const res = await api.get("/api/employeeBasic");
      console.log(res);
      
      const departmentManagers = res.data.data.filter(
        (emp) =>
          emp.Account === 4 &&
          emp.department?.[0]?.DepartmentName === task.department
      );
      setManagers(departmentManagers);
    } catch (err) {
      toast.error("Failed to load managers");
    } finally {
      setLoadingManagers(false);
    }
  }, [task.department]);

  useEffect(() => {
    loadManagers();
  }, [loadManagers]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    const formData = new FormData();

    formData.append("Taskname", task.title.trim());
    formData.append("Priority", task.priority);
    formData.append("description", task.description);
    formData.append("startDate", task.startDate);
    formData.append("endDate", task.dueDate);
    formData.append("managerEmail", task.managerEmail);
    formData.append("department", task.department);
    formData.append("adminMail", currentUserId);

    if (task.attachments) {
      Array.from(task.attachments).forEach((file) => {
        formData.append("attachments", file);
      });
    }

    try {
      await api.post("/api/tasks", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Task assigned successfully");

      setTask({
        title: "",
        priority: "",
        description: "",
        startDate: "",
        dueDate: "",
        attachments: null,
        managerEmail: "",
        department: "",
      });
      setTouched({});
    } catch (err) {
      toast.error("Failed to create task");
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field, value) => {
    if (!touched[field]) return null;
    if (!value?.trim?.() && value !== false) return "This field is required";
    return null;
  };

  return (
    <div className="container-fluid py-4">
      <TittleHeader
        title="Assign New Task"
        message="Create and delegate tasks to department managers"
      />

      <div className="row g-4 mt-2">
        {/* ─── Main Form ─── */}
        <div className="col-lg-8">
          <div
            className={`card border-0 shadow-sm ${
              !darkMode ? "bg-dark text-light" : "bg-white"
            }`}
          >
            <div className="card-body p-4 p-lg-5">
              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-4">
                  {/* Title & Priority */}
                  <div className="col-md-8">
                    <label className="form-label fw-semibold d-flex align-items-center gap-2">
                      <ClipboardList size={18} />
                      Task Title
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-lg ${
                        getFieldError("title", task.title) ? "is-invalid" : ""
                      }`}
                      placeholder="Implement user authentication flow"
                      value={task.title}
                      onChange={(e) =>
                        setTask({ ...task, title: e.target.value })
                      }
                      onBlur={() => handleBlur("title")}
                      required
                    />
                    {getFieldError("title", task.title) && (
                      <div className="invalid-feedback d-flex align-items-center gap-1 mt-1">
                        <AlertCircle size={14} /> Required field
                      </div>
                    )}
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold d-flex align-items-center gap-2">
                      <Flag size={18} />
                      Priority
                    </label>
                    <select
                      className={`form-select form-select-lg ${
                        getFieldError("priority", task.priority)
                          ? "is-invalid"
                          : ""
                      }`}
                      value={task.priority}
                      onChange={(e) =>
                        setTask({ ...task, priority: e.target.value })
                      }
                      onBlur={() => handleBlur("priority")}
                      required
                    >
                      <option value="">Select priority</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                    {getFieldError("priority", task.priority) && (
                      <div className="invalid-feedback">Required</div>
                    )}
                  </div>

                  {/* Department & Manager */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold d-flex align-items-center gap-2">
                      <Building2 size={18} />
                      Department
                    </label>
                    <select
                      className={`form-select form-select-lg ${
                        getFieldError("department", task.department)
                          ? "is-invalid"
                          : ""
                      }`}
                      value={task.department}
                      onChange={(e) =>
                        setTask({
                          ...task,
                          department: e.target.value,
                          managerEmail: "",
                        })
                      }
                      onBlur={() => handleBlur("department")}
                      required
                    >
                      <option value="">Select department</option>
                      {departments.map((dep) => (
                        <option key={dep._id} value={dep.DepartmentName}>
                          {dep.DepartmentName}
                        </option>
                      ))}
                    </select>
                    {getFieldError("department", task.department) && (
                      <div className="invalid-feedback">Required</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold d-flex align-items-center gap-2">
                      <User size={18} />
                      Assign to Manager
                    </label>
                    <select
                      className={`form-select form-select-lg ${
                        getFieldError("managerEmail", task.managerEmail)
                          ? "is-invalid"
                          : ""
                      }`}
                      value={task.managerEmail}
                      onChange={(e) =>
                        setTask({ ...task, managerEmail: e.target.value })
                      }
                      onBlur={() => handleBlur("managerEmail")}
                      disabled={!task.department || loadingManagers}
                      required
                    >
                      <option value="">
                        {loadingManagers
                          ? "Loading managers..."
                          : task.department
                          ? "Select manager"
                          : "Select department first"}
                      </option>
                      {managers.map((m) => (
                        <option key={m._id} value={m.Email}>
                          {m.FirstName} {m.LastName} ({m.Email})
                        </option>
                      ))}
                    </select>
                    {getFieldError("managerEmail", task.managerEmail) && (
                      <div className="invalid-feedback">Required</div>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold d-flex align-items-center gap-2">
                      <Calendar size={18} />
                      Start Date
                    </label>
                    <input
                      type="date"
                      className={`form-control form-control-lg ${
                        getFieldError("startDate", task.startDate)
                          ? "is-invalid"
                          : ""
                      }`}
                      value={task.startDate}
                      onChange={(e) =>
                        setTask({ ...task, startDate: e.target.value })
                      }
                      onBlur={() => handleBlur("startDate")}
                      required
                    />
                    {getFieldError("startDate", task.startDate) && (
                      <div className="invalid-feedback">Required</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold d-flex align-items-center gap-2">
                      <Calendar size={18} />
                      Due Date
                    </label>
                    <input
                      type="date"
                      className={`form-control form-control-lg ${
                        getFieldError("dueDate", task.dueDate)
                          ? "is-invalid"
                          : ""
                      }`}
                      value={task.dueDate}
                      min={task.startDate || undefined}
                      onChange={(e) =>
                        setTask({ ...task, dueDate: e.target.value })
                      }
                      onBlur={() => handleBlur("dueDate")}
                      required
                    />
                    {getFieldError("dueDate", task.dueDate) && (
                      <div className="invalid-feedback">Required</div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Task Description
                    </label>
                    <div
                      className={
                        getFieldError("description", task.description)
                          ? "border border-danger rounded"
                          : ""
                      }
                    >
                      <RichTextEditor
                        value={task.description}
                        onChange={(html) =>
                          setTask({ ...task, description: html })
                        }
                        placeholder="Describe the task in detail... objectives, requirements, acceptance criteria, etc."
                      />
                    </div>
                    {getFieldError("description", task.description) && (
                      <div className="text-danger small mt-1 d-flex align-items-center gap-1">
                        <AlertCircle size={14} /> Please provide a description
                      </div>
                    )}
                  </div>

                  {/* Attachments */}
                  <div className="col-12">
                    <label className="form-label fw-semibold d-flex align-items-center gap-2">
                      <UploadCloud size={18} />
                      Attachments (optional)
                    </label>
                    <div className="input-group input-group-lg">
                      <input
                        type="file"
                        multiple
                        className="form-control"
                        onChange={(e) =>
                          setTask({ ...task, attachments: e.target.files })
                        }
                      />
                      <span className="input-group-text bg-light text-muted">
                        {task.attachments
                          ? `${task.attachments.length} file(s)`
                          : "No files chosen"}
                      </span>
                    </div>
                    <small className="text-muted">
                      Max 10MB per file recommended
                    </small>
                  </div>

                  {/* Submit */}
                  <div className="col-12 text-end mt-4">
                    <button
                      type="submit"
                      disabled={!isFormValid()}
                      className="btn btn-primary btn-lg px-5"
                    >
                      Create & Assign Task
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ─── Clean Preview Panel ─── */}
        <div className="col-lg-4">
          <div
            className={`card border-0 shadow-sm position-sticky ${
              !darkMode ? "bg-dark text-light" : "bg-white"
            }`}
            style={{ top: "1.5rem" }}
          >
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4 border-bottom pb-3">Task Preview</h5>

              <div className="mb-3">
                <small className="text-uppercase text-muted">Title</small>
                <p className="mb-0 fw-medium">{task.title || "—"}</p>
              </div>

              <div className="mb-3">
                <small className="text-uppercase text-muted">Priority</small>
                <p className="mb-0">
                  {task.priority ? (
                    <span
                      className={`badge bg-${
                        task.priority === "Urgent"
                          ? "danger"
                          : task.priority === "High"
                          ? "warning"
                          : task.priority === "Medium"
                          ? "info"
                          : "secondary"
                      }`}
                    >
                      {task.priority}
                    </span>
                  ) : (
                    "—"
                  )}
                </p>
              </div>

              <div className="mb-3">
                <small className="text-uppercase text-muted">Department</small>
                <p className="mb-0">{task.department || "—"}</p>
              </div>

              <div className="mb-3">
                <small className="text-uppercase text-muted">Manager</small>
                <p className="mb-0">{task.managerEmail || "—"}</p>
              </div>

              <div className="row g-3">
                <div className="col-6">
                  <small className="text-uppercase text-muted">Start</small>
                  <p className="mb-0">{task.startDate || "—"}</p>
                </div>
                <div className="col-6">
                  <small className="text-uppercase text-muted">Due</small>
                  <p className="mb-0">{task.dueDate || "—"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskAssign;
