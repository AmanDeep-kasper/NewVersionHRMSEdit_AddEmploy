import React, { useEffect, useState, useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import BASE_URL from './config/config';
import axios from 'axios';
import profile from "../img/profile.jpg"
import { AttendanceContext } from '../Context/AttendanceContext/AttendanceContext';
import { useNavigate } from 'react-router-dom';
import api from './config/api';


const TeamList = () => {
  const history = useNavigate();
  const {setManagerMail} = useContext(AttendanceContext)
  const [showModal, setShowModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [teamData,setTeamData] = useState({});

  const handleViewClick = (department) => {
    setSelectedDepartment(department);
    setShowModal(true);
  };
  
 useEffect(() => {
  const fetchEmployeeData = async () => {
    try {

      const response = await api.get(`/api/employeeByDepartment`, {
      });

      if (response.status === 200) {
        setTeamData(response.data);
      } else {
        console.error("Unexpected response:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error.message);
    }
  };

  fetchEmployeeData();
}, []);

  

  const handleCloseModal = () => setShowModal(false);
const navigationHandler = (val)=>{
  setManagerMail(val.Email);
  history.push("/admin/managerTeam");
}
  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Team</h5>
        <span>{Object.keys(teamData).length}</span>
      </div>
      <ul className="list-group list-group-flush">
        {Object.keys(teamData).length>0 && Object.keys(teamData).map((department, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{department}</strong>
              <div className="d-flex align-items-center">
                {teamData[department].map((member, idx) => (
                  <img
                    key={idx}
                    src={member.profile===null?profile:member.profile.image_url}
                    alt={member.name}
                    className="rounded-circle me-2"
                    style={{ width: '30px', height: '30px' }}
                  />
                ))}
                {teamData[department].length>4?<>+{teamData[department].length-4}</>:<></>}
                
              </div>
            </div>
            <Button variant="link" onClick={() => handleViewClick(department)}>View</Button>
          </li>
        ))}
      </ul>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedDepartment} Team</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDepartment && teamData[selectedDepartment].length > 0 ? (
            <ul className="list-group">
              {teamData[selectedDepartment].map((member, idx) => (
                <>
                <li key={idx} className="list-group-item d-flex align-items-center justify-content-between" >
                  <div className=" d-flex align-items-center ">
                  <img
                     src={member.profile===null?profile:member.profile.image_url}
                    alt={member.name}
                    className="rounded-circle me-3"
                    style={{ width: '40px', height: '40px' }}
                  />
                  <span>{`${member.FirstName} ${member.LastName}`}</span></div>
                  <Button variant="link" onClick={()=>navigationHandler(member)} >View Team</Button>
                </li>
                 
                 </>
              ))}
              
            </ul>
          ) : (
            <p>No members in this team.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TeamList;
