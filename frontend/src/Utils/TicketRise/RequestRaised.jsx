import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import moment from 'moment';
import BASE_URL from '../../Pages/config/config';
import { useSelector } from 'react-redux';
import api from '../../Pages/config/api';

const RequestRaised = () => {
  const { userData} = useSelector((state)=> state.user);
  const email = userData?.Email;
  const [data, setData] = useState([]);
  const [darkMode, setDarkMode] = useState(false); 
  const [showModal, setShowModal] = useState(false); 
  const [updateData, setUpdateData] = useState({
    id: "",
    remark: "",
    updatedBy: email,
    status: ""
  });

  useEffect(() => {
    api
      .post(
        `/api/requestRaised`,
        { email },
      )
      .then((response) => {
        
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error loading request data", error);
      });
  }, [email]);

  const handleCloseModal = () => setShowModal(false);

  const handleShowModal = (req) => {
    setUpdateData((prev) => ({ ...prev, id: req._id, status: req.status === "Close" ? "Pending" : "Close" }));
    setShowModal(true);
  };

  const handleRemarkChange = (event) => setUpdateData((prev) => ({ ...prev, remark: event.target.value }));

  const handleSaveRemark = () => {
    api
      .post(
        `/api/updateRequest`,
        updateData,
        
      )
      .then(() => {
         ;
        data.forEach((val) => {
          if (val._id === updateData.id) {
            val.status = updateData.status;
            val.reOpen.push({ remark: updateData.remark, updatedBy: email, updatedAt: new Date() });
          }
        });
        setUpdateData({
          id: "",
          remark: "",
          updatedBy: email,
          status: ""
        });
      })
      .catch((error) => {
        console.error("Error updating request data", error);
      });
    handleCloseModal();
  };

  const isCompleteButtonDisabled = (val) => {
     
   
    if(val){
      const updatedAtTime = moment(val.updatedAt);
      const currentTime = moment();
       
      return currentTime.diff(updatedAtTime, 'hours') > 72;
    }
  
  };

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between align-items-center">
        <h3>Request Details</h3>
      </div>

      <div className="my-3">
        <div className="d-flex flex-column gap-2">
          {data.length > 0 ? (
            data.map((request) => (
              <div
                key={request._id}
                style={{
                  color: darkMode
                    ? "var(--primaryDashColorDark)"
                    : "var(--secondaryDashMenuColor)",
                }}
                className="col-12 col-md-6 col-lg-4 p-2"
              >
                <div
                  style={{
                    border: !darkMode
                      ? "1px solid var(--primaryDashMenuColor)"
                      : "1px solid var(--secondaryDashColorDark)",
                  }}
                  className="task-hover-effect p-2"
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <h5>{request.subject}</h5>
                    <button className={`btn ${getStatusClass(request.status)}`}>
                      {request.status}
                    </button>
                  </div>
                  <hr />
                  <div className="d-flex align-items-center gap-2 justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <p className='mb-0'>Requested By:</p>
                      <span>{request.requestedBy}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <p className='mb-0'>To:</p>
                      <span>{request.to}</span>
                    </div>
                  </div>
                  <hr />
                  <div className="d-flex align-items-center gap-2">
                    <div className="d-flex justify-content-between w-100">
                      <div>
                        <h6>CC:</h6>
                        <span>{request.cc.join(', ')}</span>
                      </div>
                      <div>
                        <p><strong>Time:</strong> {moment(request.createdAt).format('DD/MM/YYYY hh:mm A')}</p>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="my-3 d-flex flex-column gap-1">
                    <h6>Remark</h6>
                    <span>{request.remark}</span>
                  </div>
                  {request.reOpen?.length > 0 && (
                    <div className="mt-3">
                      <h6>Reopen Details:</h6>
                      {request.reOpen.map((reopen, index) => (
                        <div key={index} className="mt-2">
                          <div className='d-flex justify-content-between'>
                            <div><strong>Updated By:</strong> {reopen.updatedBy}</div>
                            <div><strong>Time</strong> {moment(reopen.updatedAt).format('DD/MM hh:mm A')}</div>
                          </div>
                          <div><strong>Remark:</strong> {reopen.remark}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <hr />
                  <div className="text-start mt-3">
                    {request.status === 'Pending' ? (
                      <Button
                        variant="primary"
                        onClick={() => handleShowModal(request)}
                       
                      >
                        Complete
                      </Button>
                    ) : request.status === 'Close' ? (
                      <Button
                        variant="secondary"
                        onClick={() => handleShowModal(request)}
                        disabled={isCompleteButtonDisabled(request.reOpen[request.reOpen.length-1] )}
                      >
                        Reopen
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              className="d-flex flex-column gap-3 align-items-center justify-content-center"
              style={{ height: "80vh" }}
            >
              <img
                style={{ width: "30%", height: "auto" }}
                src="path/to/placeholder/image.jpg"
                alt="No Requests"
              />
              <p
                style={{
                  color: darkMode
                    ? "var(--primaryDashColorDark)"
                    : "var(--secondaryDashMenuColor)",
                }}
              >
                Sorry, there are no requests to display.
              </p>
            </div>
          )}
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Remark</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="remark">
              <Form.Label>Remark</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={updateData.remark}
                onChange={handleRemarkChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveRemark}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Close':
      return 'btn-success';
    case 'Pending':
      return 'btn-warning';
    default:
      return 'btn-secondary';
  }
};

export default RequestRaised;


