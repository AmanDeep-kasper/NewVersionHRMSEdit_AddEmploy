import { useState, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import TittleHeader from "../../../Pages/TittleHeader/TittleHeader";
import reminderImage from "../../../img/Todo/Reminder.svg";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { useSelector } from "react-redux";
import { MdOutlineSendTimeExtension } from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5";
import Cookies from "js-cookie";
const getStoredReminders = () => {
  // ✅ Read reminders from cookies instead of localStorage
  const reminders = Cookies.get("reminders");
  return reminders ? JSON.parse(reminders) : [];
};



const DateCard = ({ dateString }) => {
  const date = new Date(dateString);
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();

  return (
    <div
      style={{
        height: "3.2rem",
        width: "3.2rem",
        minHeight: "3.2rem",
        minWidth: "3.2rem",
        overflow: "hidden",
      }}
      className="rounded-3 bg-white shadow-sm"
    >
      <div
        className="bg-primary text-white d-flex align-items-center justify-content-center"
        style={{ height: "1.4rem" }}
      >
        {month}
      </div>
      <div
        className="fw-bold d-flex align-items-center justify-content-center"
        style={{ height: "2rem" }}
      >
        <h6 className="fw-bold text-muted my-0">{day}</h6>
      </div>
    </div>
  );
};

const ReminderApp = () => {
  const [reminders, setReminders] = useState(getStoredReminders());
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [priority, setPriority] = useState("Low");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const { darkMode } = useTheme();
  const [expandedReminder, setExpandedReminder] = useState(null);
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    Cookies.setItem("reminders", JSON.stringify(reminders));
  }, [reminders]);

  const addReminder = () => {
    if (!title || !date || !startTime || !endTime) {
      alert("Please fill out all fields!");
      return;
    }

    const newReminder = {
      id: Date.now(),
      title,
      date,
      startTime,
      endTime,
      priority,
      user: userData._id,
    };

    setReminders([...reminders, newReminder]);
    resetForm();
  };

  const editReminder = (id) => {
    const reminderToEdit = reminders.find((reminder) => reminder.id === id);
    if (reminderToEdit) {
      setTitle(reminderToEdit.title);
      setDate(reminderToEdit.date);
      setStartTime(reminderToEdit.startTime);
      setEndTime(reminderToEdit.endTime);
      setPriority(reminderToEdit.priority);
      setIsEditing(true);
      setEditId(id);
    }
  };

  const updateReminder = () => {
    if (!title || !date || !startTime || !endTime) {
      alert("Please fill out all fields!");
      return;
    }

    const updatedReminders = reminders.map((reminder) =>
      reminder.id === editId
        ? {
            ...reminder,
            title,
            date,
            startTime,
            endTime,
            priority,
          }
        : reminder
    );

    setReminders(updatedReminders);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setPriority("Low");
    setIsEditing(false);
    setEditId(null);
  };

  const deleteReminder = (id) => {
    const updatedReminders = reminders.filter((reminder) => reminder.id !== id);
    setReminders(updatedReminders);
  };

  const forwardReminder = (reminderId) => {
    const reminderToForward = reminders.find(
      (reminder) => reminder.id === reminderId
    );
    if (reminderToForward) {
      // Simulate forwarding by alerting the email recipients
      alert(`Reminder forwarded to: ${reminderToForward.receiver.join(", ")}`);
    }
  };

  return (
    <div className="m-3">
      <div className="mb-2">
        <TittleHeader
          title={"Reminder"}
          message={"You can view and create reminders here"}
        />
      </div>
      <div className="d-flex gap-2">
        {/* Form Section */}
        <div
          className="d-flex flex-column gap-2 p-3 bg-white rounded-3"
          style={{ width: "25rem", height: "fit-content" }}
        >
          <textarea
            className="form-control"
            placeholder="Reminder Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              maxHeight: "50vh",
              height: "30vh",
            }}
          />
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="time"
            className="form-control"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <input
            className="form-control"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          {/* Priority Selector */}
          <select
            className="form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          {isEditing ? (
            <div className="d-flex flex-column gap-2">
              <button className="btn btn-success" onClick={updateReminder}>
                Update Reminder
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  resetForm();
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button className="btn btn-primary" onClick={addReminder}>
              Add Reminder
            </button>
          )}
        </div>

        <div
          className="d-flex flex-column gap-2 p-3 bg-white rounded-3"
          style={{ width: "100%", height: "75vh", overflowY: "scroll" }}
        >
          {reminders.length === 0 ? (
            <p
              className="d-flex align-items-center flex-column gap-2 justify-content-center"
              style={{ height: "100%" }}
            >
              <img
                style={{ height: "15rem", width: "15rem" }}
                src={reminderImage}
                alt="No Reminder"
              />
              No reminders added yet.
            </p>
          ) : (
            reminders
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((reminder) => (
                <div className="p-2 border rounded-2">
                  <div
                    className="d-flex gap-2 p-2 rounded-3 shadow-sm bg-light"
                    key={reminder.id}
                  >
                    <DateCard dateString={reminder.date} />
                    <div
                      className="d-flex flex-column justify-content-between w-100"
                      onClick={() => setExpandedReminder(reminder.id)}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-2">
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: ".5rem",
                            }}
                            className={`${
                              darkMode ? "badge-success" : "badge-success-dark"
                            }`}
                          >
                            <IoTimeOutline /> {reminder.startTime}
                          </span>
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: ".5rem",
                            }}
                            className={`${
                              darkMode ? "badge-danger" : "badge-danger-dark"
                            }`}
                          >
                            {" "}
                            <IoTimeOutline />
                            {reminder.endTime}
                          </span>
                          {reminder.priority === "Low" && (
                            <span
                              className={`${
                                darkMode
                                  ? "badge-primary"
                                  : "badge-primary-danger"
                              }`}
                            >
                              {reminder.priority}
                            </span>
                          )}
                          {reminder.priority === "Medium" && (
                            <span
                              className={`${
                                darkMode
                                  ? "badge-warning"
                                  : "badge-warning-danger"
                              }`}
                            >
                              {reminder.priority}
                            </span>
                          )}
                          {reminder.priority === "High" && (
                            <span
                              className={`${
                                darkMode
                                  ? "badge-danger"
                                  : "badge-danger-danger"
                              }`}
                            >
                              {reminder.priority}
                            </span>
                          )}
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            onClick={() => forwardReminder(reminder.id)}
                            className="btn fs-4"
                          >
                            <MdOutlineSendTimeExtension />
                          </button>

                          <button
                            onClick={() => editReminder(reminder.id)}
                            className="btn fs-4"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => deleteReminder(reminder.id)}
                            className="btn fs-4"
                          >
                            <AiOutlineDelete />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="bg-white p-2 px-3 rounded-0 ">
                    {expandedReminder === reminder.id
                      ? reminder.title
                      : reminder.title.substring(0, 200) +
                        (reminder.title.length > 200 ? "..." : "")}
                    {reminder.title.length > 200 && (
                      <span
                        className="badge-primary mx-3"
                        style={{
                          fontSize: "0.9rem",
                          cursor: "pointer",
                          width: "fit-content",
                        }}
                        onClick={() =>
                          setExpandedReminder(
                            expandedReminder === reminder.id
                              ? null
                              : reminder.id
                          )
                        }
                      >
                        {expandedReminder === reminder.id
                          ? "Read Less"
                          : "Read More"}
                      </span>
                    )}
                  </p>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReminderApp;
