import React, { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { MdDeleteForever } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../../../Context/TheamContext/ThemeContext";
import { AttendanceContext } from "../../../../Context/AttendanceContext/AttendanceContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../../Pages/config/config";
import toast from "react-hot-toast";
import { v4 as uuid } from "uuid";
import api from "../../../../Pages/config/api";

const TaskModal = ({
  show,
  onHide,
  // rowData,
  // selectedEmployees,
  // setSelectedEmployees,
  forwardTask,
}) => {
  // const [inputEmail, setInputEmail] = useState("");
  // const [filteredEmployees, setFilteredEmployees] = useState(rowData);
  // const [selectAll, setSelectAll] = useState(false);

  // const handleSearch = (e) => {
  //   const searchValue = e.target.value.toLowerCase();
  //   setInputEmail(searchValue);

  //   if (searchValue === "") {
  //     setFilteredEmployees(rowData);
  //   } else {
  //     const filtered = rowData.filter(
  //       (employee) =>
  //         employee.FirstName.toLowerCase().includes(searchValue) ||
  //         employee.Email.toLowerCase().includes(searchValue) ||
  //         employee.PositionName.toLowerCase().includes(searchValue)
  //     );
  //     setFilteredEmployees(filtered);
  //   }
  // };

  // const toggleSelectAll = () => {
  //   setSelectAll(!selectAll);
  //   setSelectedEmployees(selectAll ? [] : [...rowData]);
  // };

  // const addSelectedEmployee = (employee) => {
  //   if (selectedEmployees.some((emp) => emp.Email === employee.Email)) {
  //     setSelectedEmployees((prev) =>
  //       prev.filter((emp) => emp.Email !== employee.Email)
  //     );
  //   } else {
  //     setSelectedEmployees((prev) => [...prev, employee]);
  //   }
  // };

  // const removeSelectedEmployee = (email) => {
  //   setSelectedEmployees((prev) => prev.filter((emp) => emp.Email !== email));
  // };

  const dispatch = useDispatch();
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const { userData } = useSelector((state) => state.user);
  const [modalShow, setModalShow] = React.useState(false);
  const name = `${userData?.FirstName} ${userData?.LastName}`;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [, setIsCompleting] = useState(false);
  const [getEmployee, setGetEmployee] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [inputEmail, setInputEmail] = useState("");
  const [originalEmployeeData, setOriginalEmployeeData] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectAll, setSelectAll] = useState(false);
  const [isForwardButtonDisabled, setIsForwardButtonDisabled] = useState(true);
  const email = userData?.Email;
  const [employeeData, setEmployeeData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [taskDepartment, setTaskDepartment] = useState("");
  // const { socket } = useContext(AttendanceContext);
  const [taskName, setTaskName] = useState("");
  const [allImage, setAllImage] = useState(null);
  const [empData, setEmpData] = useState(null);
  const { darkMode } = useTheme();
  const [flash, setFlash] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewDetsils, setViewDetails] = useState(false);
  const [timeinfo, setTimeinfo] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const { socket, setMessageData, setProfile } = useContext(AttendanceContext);
  const navigate = useNavigate();

console.log(selectedTaskId);


  const loadEmployeeData = () => {
    api
      .get(`/api/employee`, {
        
      })
      .then((response) => {
        const employeeObj = response.data;

        const emp = response.data.filter((val) => {
          return val.Email === email;
        });

        setEmpData(emp);
        setEmployeeData(employeeObj);
        setLoading(false);
        const rowDataT = employeeObj.map((data) => {
          return {
            data,
            Email: data["Email"],
            department: data["department"][0]["DepartmentName"],
            FirstName: data["FirstName"] + "" + data["LastName"],
            ContactNo: data["ContactNo"],
            PositionName: data["position"][0]
              ? data["position"][0]["PositionName"]
              : "",
          };
        });

        setRowData(rowDataT);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    loadEmployeeData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get(`/api/tasks`, {
      });
      setTasks(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
      setError("Error fetching tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const forwordTaskToEmployee = async (taskId, dep, taskName, task) => {
    const employeeEmails = task.employees.map((emp) => emp.employee.Email);

    let filteredData = rowData.filter((val) => {
      return (
        !employeeEmails.includes(val.Email) &&
        val.Email !== email &&
        (val.data.reportHr === email || val.data.reportManager === email) &&
        val.data.Account === 3 &&
        val.data.status === "active"
      );
    });

    setTaskName(taskName);
    setRowData(filteredData);
    setTaskDepartment(dep);
    setSelectedTaskId(taskId);
    setModalShow(true);
  };

  const forwardTaskToEmployees = async (selectedTaskId) => {
    try {
      const employeeNotificationArr = [];
      for (const employee of selectedEmployees) {
        try {
          employeeNotificationArr.push(employee.Email);
          const employeeData = {
            empname: employee.FirstName,
            empemail: employee.Email,
            empdesignation: employee.PositionName,
            empTaskStatus: "Task Assigned",
          };

          await api.post(
            `/api/tasks/${selectedTaskId}/employees`,
            {
              employees: [employeeData],
            },
          );
        } catch (error) {
          console.error(
            `Error forwarding task to ${employee.FirstName}:`,
            error.message
          );
        }
      }
      const taskId = uuid();

      if (empData[0].profile) {
        const employeeTaskNotification = {
          senderMail: email,
          employeesEmail: employeeNotificationArr,
          taskId,
          status: "unseen",
          message: `Task Assigned`,
          messageBy: name,
          profile: empData[0].profile.image_url,
          taskName,
          Account: 2,
          path: "newTask",
        };

        socket.emit("employeeTaskNotification", employeeTaskNotification);
      } else {
        const employeeTaskNotification = {
          senderMail: email,
          employeesEmail: employeeNotificationArr,
          taskId,
          status: "unseen",
          message: `Task Assigned`,
          messageBy: name,
          profile: null,
          taskName,
          Account: 2,
          path: "newTask",
        };

        socket.emit("employeeTaskNotification", employeeTaskNotification);
      }
      fetchData();

      setSelectedEmployees([]);
      setModalShow(false);
    } catch (error) {
      console.error("Error forwarding task:", error.message);
      toast.error("Failed to forward task. Please try again.");
    }
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();

    if (searchValue === "") {
      setGetEmployee(originalEmployeeData);
    } else {
      const filteredEmployees = originalEmployeeData.filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchValue) ||
          employee.email.toLowerCase().includes(searchValue) ||
          employee.designation.toLowerCase().includes(searchValue)
      );

      setGetEmployee(filteredEmployees);
    }
  };

  const handleInputChange = (e) => {
    setInputEmail(e.target.value);
  };

  const removeSelectedEmployee = (email) => {
    setSelectedEmployees(
      selectedEmployees.filter((employee) => employee.Email !== email)
    );
  };

  const addSelectedEmployee = (employee) => {
    const isChecked = selectedEmployees.some(
      (emp) => emp.Email === employee.Email
    );

    if (isChecked) {
      setSelectedEmployees((prevEmployees) =>
        prevEmployees.filter((emp) => emp.Email !== employee.Email)
      );
    } else {
      setSelectedEmployees([...selectedEmployees, employee]);
    }
    if (selectedEmployees.length < 0) {
      setIsForwardButtonDisabled(true);
    } else {
      setIsForwardButtonDisabled(false); // Disable the button when there is at least one selected employee
    }

    setInputEmail("");
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedEmployees(selectAll ? [] : [...rowData]);
  };

  return (
    // <Modal
    //     fullscreen={true}
    //    show={show} onHide={onHide}
    //   >
    //     <Modal.Header closeButton>
    //       <Modal.Title>Forward Task to Employees</Modal.Title>
    //     </Modal.Header>
    //     <Modal.Body>
    //       <div className="row">
    //         <form className="d-flex col-8 flex-column gap-3">
    //           <input
    //             className="w-100 py-1 px-2 rounded-5 border"
    //             type="search"
    //             name=""
    //             placeholder="Search..."
    //             id=""
    //             value={inputEmail}
    //             onChange={(e) => {
    //               handleInputChange(e);
    //               handleSearch(e);
    //             }}
    //           />
    //           <div>
    //             <div className=" p-2">
    //               {" "}
    //               <input
    //                 type="checkbox"
    //                 name=""
    //                 id=""
    //                 onChange={toggleSelectAll}
    //                 checked={selectAll}
    //               />{" "}
    //               <span>Select All</span>
    //             </div>
    //             <table class="table">
    //               <thead>
    //                 <tr>
    //                   <th>Select</th>
    //                   <th>Name</th>
    //                   <th>Email</th>
    //                   <th>Contact</th>
    //                   <th>Designation</th>
    //                 </tr>
    //               </thead>

    //               <tbody>
    //                 {rowData.map((row, index) => (
    //                   <tr key={index}>
    //                     <th scope="row">
    //                       <input
    //                         type="checkbox"
    //                         name=""
    //                         id=""
    //                         onChange={() => addSelectedEmployee(row)}
    //                         checked={selectedEmployees.some(
    //                           (emp) => emp.Email === row.Email
    //                         )}
    //                       />
    //                     </th>
    //                     <td>{row.FirstName}</td>
    //                     <td>{row.Email}</td>
    //                     <td>{row.ContactNo}</td>
    //                     <td>{row.PositionName}</td>
    //                   </tr>
    //                 ))}
    //               </tbody>
    //             </table>
    //           </div>
    //         </form>
    //         <div className="d-flex flex-column col-4 gap-2 ">
    //           <div
    //             className="row form-control d-flex pt-3 rounded mx-1 justify-content-between"
    //             style={{ height: "fit-content" }}
    //           >
    //             <div>
    //               <span className="fw-bold ">Selected Employees:</span>
    //               {selectedEmployees.map((employee, index) => (
    //                 <div key={index} className="d-flex">
    //                   <span
    //                     style={{
    //                       boxShadow: "-3px 3px 5px rgba(204, 201, 201, 0.767)",
    //                       width: "fit-content",
    //                     }}
    //                     className="selected-employee-email d-flex btn gap-2 aline-center  btn-light py-1 px-2 m-1"
    //                     onClick={() => removeSelectedEmployee(employee.Email)}
    //                   >
    //                     {employee.FirstName} - {employee.PositionName}
    //                     <span className="text-danger d-none">
    //                       <MdDeleteForever />
    //                     </span>
    //                   </span>
    //                 </div>
    //               ))}
    //             </div>
    //           </div>

    //           <button
    //             className="btn  btn-primary "
    //             onClick={() => forwardTaskToEmployees(selectedTaskId)}
    //             disabled={isForwardButtonDisabled}
    //           >
    //             Forward Task to Employees
    //           </button>
    //           <button
    //             className="btn btn-secondary"
    //             onClick={() => setModalShow(false)}
    //           >
    //             Cancel
    //           </button>
    //         </div>
    //       </div>
    //     </Modal.Body>
    //   </Modal>


    <Modal fullscreen={true} show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Forward Task to Employees</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <form className="d-flex col-8 flex-column gap-3">
            <input
              className="w-100 py-1 px-2 rounded-5 border"
              type="search"
              placeholder="Search..."
              value={inputEmail}
              onChange={handleSearch}
            />
            <div>
              <div className="p-2">
                <input
                  type="checkbox"
                  onChange={toggleSelectAll}
                  checked={selectAll}
                />{" "}
                <span>Select All</span>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Designation</th>
                  </tr>
                </thead>
                <tbody>
                {rowData.map((row, index) => (
                      <tr key={index}>
                        <th scope="row">
                          <input
                            type="checkbox"
                            name=""
                            id=""
                            onChange={() => addSelectedEmployee(row)}
                            checked={selectedEmployees.some(
                              (emp) => emp.Email === row.Email
                            )}
                          />
                        </th>
                        <td>{row.FirstName}</td>
                        <td>{row.Email}</td>
                        <td>{row.ContactNo}</td>
                        <td>{row.PositionName}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </form>
          <div className="d-flex flex-column col-4 gap-2">
            <div className="form-control d-flex pt-3 rounded mx-1 justify-content-between">
              <div>
                <span className="fw-bold">Selected Employees:</span>
                {selectedEmployees.map((employee, index) => (
                  <div key={index} className="d-flex">
                    <span
                      className="selected-employee-email d-flex btn gap-2 align-center btn-light py-1 px-2 m-1"
                      onClick={() => removeSelectedEmployee(employee.Email)}
                    >
                      {employee.FirstName} - {employee.PositionName}
                      <MdDeleteForever />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={forwardTask}
              disabled={selectedEmployees.length === 0}
            >
              Forward Task to Employees
            </button>
            <button className="btn btn-secondary" onClick={onHide}>
              Cancel
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default TaskModal;
