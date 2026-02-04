// import React, { useContext, useEffect, useRef, useState } from "react";
// import { Modal, Button } from "react-bootstrap"; // Use Bootstrap or any modal library you prefer
// import { AttendanceContext } from "../../../../Context/AttendanceContext/AttendanceContext";
// import { useSelector } from "react-redux";
// import { useLocation } from "react-router-dom";
// import { useTheme } from "../../../../Context/TheamContext/ThemeContext";
// import { v4 as uuidv4 } from "uuid";

// const ChatModal = ({ task, onClose }) => {
//   const { socket, setChat, chat } = useContext(AttendanceContext);
//   const { userData } = useSelector((state) => state.user);
//   const chatw = useSelector((state) => state.chat);

//   const { taskId, to, profile, taskName } = chatw;

//   const email = userData?.Email;
//   const name = `${userData?.FirstName} ${userData?.LastName}`;
//   const [newMessage, setNewMessage] = useState("");
//   const messagesEndRef = useRef(null);
//   const chatContainerRef = useRef(null);
//   const location = useLocation().pathname.split("/")[2];
//   const notiId = uuidv4();
//   const { darkMode } = useTheme();

//   useEffect(() => {
//     socket.emit(
//       "getMessages",
//       {
//         from: email,
//         to: to,
//         taskId: taskId,
//         bwt: "admin-manager",
//       },
//       (data) => {
//         setChat(data);
//       }
//     );
//   }, [socket, email, taskId, to, setChat]);

//   const handleSendMessage = () => {
//     if (!newMessage.trim()) {
//       return;
//     }

//     const timestamp = new Date().toISOString();

//     socket.emit("sendMessage", {
//       notiId,
//       profile: profile ? profile.image_url : null,
//       from: email,
//       taskName,
//       to: to,
//       taskId: taskId,
//       text: newMessage,
//       name: name,
//       createAt: timestamp,
//       bwt: "admin-manager",
//     });

//     setChat((prevChat) => [
//       ...prevChat,
//       { text: newMessage, from: email, fromName: name, createAt: timestamp },
//     ]);
//     setNewMessage("");
//   };

//   useEffect(() => {
//     socket.on("newMessage", (data) => {
//       if (location === data.path && taskId === data.taskIden) {
//         setChat((prevChat) => [...prevChat, data]);
//       }
//     });

//     return () => {
//       socket.off("newMessage");
//     };
//   }, [socket, location, setChat]);

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
//     }
//   }, [chat]);

//   const formatDate = (timestamp) => {
//     try {
//       if (!timestamp) return "Invalid Date";
//       const date = new Date(timestamp);
//       if (isNaN(date.getTime())) return "Invalid Date"; // Check for invalid date

//       const today = new Date();
//       if (date.toDateString() === today.toDateString()) {
//         // If the date is today, show only the time
//         return date.toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         });
//       } else {
//         // If the date is not today, show the date (month and day) and the time
//         return (
//           date.toLocaleDateString(undefined, {
//             month: "short",
//             day: "numeric",
//           }) +
//           " " +
//           date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//         );
//       }
//     } catch (error) {
//       console.error("Error parsing date:", error);
//       return "Invalid Date";
//     }
//   };
//   return (
//     <Modal show={true} onHide={onClose} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Chat About Task: {task.Taskname}</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//       {chat.length > 0 ? (
//           <div
//             ref={chatContainerRef}
//             style={{
//               overflow: "auto",
//               maxHeight: "50vh",
//               padding: "16px",
//               display: "flex",
//               flexDirection: "column",
//               gap: "8px",
//               overflowY: "scroll",
//             }}
//           >
//             {chat.map((message, index) => (
//               <div
//                 key={index}
//                 style={{
//                   alignSelf: message.from === email ? "flex-end" : "flex-start",
//                   backgroundColor:
//                     message.from === email ? "#d1e7dd" : "#f8d7da",
//                   padding: "10px",
//                   borderRadius: "5px",
//                   maxWidth: "80%",
//                   wordWrap: "break-word",
//                   position: "relative",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom: "0px",
//                     gap: "20px",
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontSize: "0.7em",
//                       color: "#6c757d",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     {message.from === email ? "You" : message.fromName}
//                   </span>
//                   <span style={{ fontSize: "0.6em", color: "#6c757d" }}>
//                     {formatDate(message.createAt)}
//                   </span>
//                 </div>
//                 <div className="text-dark">{message.text}</div>
//               </div>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>
//         ) : (
//           <div className="text-center py-3">Start new conversation</div>
//         )}

        
//           {/*<div
//             className="card mt-3"
//             style={{
//               height: "100%",
//               maxHeight: "375px",
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             <div className="card-header">
//               <h4>Manager Chat</h4>
//             </div>
//             <div
//               className="card-body p-0"
//               style={{
//                 flex: 1,
//                 display: "flex",
//                 flexDirection: "column",
//                 overflow: "hidden",
//               }}
//             >
//               <div
//                 className="chat chat-messages show flex-grow-1"
//                 style={{ overflowY: "auto", padding: "1rem" }}
//               >
//                 <div className="messages">
//                   <div className="chats chats-right">
//                     <div className="chat-content">
//                       <div className="chat-info">
//                         <div className="message-content">
//                           Sure, Sarah. What’s the new policy?
//                         </div>
//                       </div>
//                       <div className="chat-profile-name text-end">
//                         <h6>
//                           You<i className="ti ti-circle-filled fs-7 mx-2"></i>
//                           <span className="chat-time">08:00 AM</span>
//                           <span className="msg-read success">
//                             <i className="ti ti-checks"></i>
//                           </span>
//                         </h6>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="chats">
//                     <div className="chat-content">
//                       <div className="chat-info">
//                         <div className="message-content">
//                           Starting next month, we’ll be implementing a hybrid
//                           work model. Employees can work from home up to three
//                           days a week.
//                         </div>
//                       </div>
//                       <div className="chat-profile-name">
//                         <h6>
//                           Anthony Lewis
//                           <i className="ti ti-circle-filled fs-7 mx-2"></i>
//                           <span className="chat-time">08:00 AM</span>
//                         </h6>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               <div
//                 className="chat-footer"
//                 style={{ backgroundColor: "#f8f9fa", padding: "10px" }}
//               >
//                 <form className="footer-form">
//                   <div className="chat-footer-wrap d-flex align-items-center gap-2">
//                     <div className="form-wrap flex-grow-1">
//                       <input
//                         type="text"
//                         className="form-control"
//                         placeholder="Type Your Message"
//                       />
//                     </div>
//                     <div className="form-btn">
//                       <button className="btn btn-primary" type="submit">
//                         Send
//                       </button>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div> */}
//       </Modal.Body>
//       <Modal.Footer>
//         {/* <Button variant="secondary" onClick={onClose}>
//           Close
//         </Button>
//         <Button variant="primary" onClick={() => alert("Message Sent!")}>
//           Send
//         </Button> */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "16px",
//             padding: "8px",
//           }}
//         >
//           <input
//             style={{
//               flexGrow: "1",
//               padding: "8px",
//               borderRadius: "4px",
//               border: "1px solid #ced4da",
//             }}
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 handleSendMessage();
//               }
//             }}
//             placeholder="Type a message..."
//           />
//           <button
//             style={{
//               padding: "8px 16px",
//               backgroundColor: "#0d6efd",
//               border: "none",
//               borderRadius: "4px",
//               color: "white",
//               cursor: "pointer",
//             }}
//             onClick={handleSendMessage}
//           >
//             Send
//           </button>
//         </div>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default ChatModal;


import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap"; // Using Bootstrap modal
import { AttendanceContext } from "../../../../Context/AttendanceContext/AttendanceContext";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useTheme } from "../../../../Context/TheamContext/ThemeContext";

const ChatModal = ({ task, onClose }) => {
  const { socket, setChat, chat } = useContext(AttendanceContext);
  const { userData } = useSelector((state) => state.user);
  const chatw = useSelector((state) => state.chat);
  const { taskId, to, profile, taskName } = chatw;

  const email = userData?.Email;
  const name = `${userData?.FirstName} ${userData?.LastName}`;
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef(null);
  const notiId = uuidv4();
  const { darkMode } = useTheme();

  useEffect(() => {
    socket.emit(
      "getMessages",
      {
        from: email,
        to: to,
        taskId: taskId,
        bwt: "admin-manager",
      },
      (data) => {
        setChat(data);
      }
    );
  }, [socket, email, taskId, to, setChat]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const timestamp = new Date().toISOString();
    socket.emit("sendMessage", {
      notiId,
      profile: profile ? profile.image_url : null,
      from: email,
      taskName,
      to: to,
      taskId: taskId,
      text: newMessage,
      name: name,
      createAt: timestamp,
      bwt: "admin-manager",
    });

    setChat((prevChat) => [
      ...prevChat,
      { text: newMessage, from: email, fromName: name, createAt: timestamp },
    ]);
    setNewMessage("");
  };

  useEffect(() => {
    socket.on("newMessage", (data) => {
      if (taskId === data.taskIden) {
        setChat((prevChat) => [...prevChat, data]);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, taskId, setChat]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <Modal
      show={true}
      onHide={onClose}
      centered
      size="lg"
      style={{ maxWidth: "90%", margin: "auto" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{task.Taskname}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "16px" }}>
        <div
          ref={chatContainerRef}
          // style={{
          //   maxHeight: "60vh",
          //   overflowY: "auto",
          //   padding: "16px",
          //   backgroundColor: darkMode ? "#333" : "#f8f9fa",
          //   borderRadius: "8px",
          //   marginBottom: "16px",
          //   boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",           
          // }}
          style={{
            overflow: "auto",
            maxHeight: "60vh",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            overflowY: "scroll",
            marginBottom: "16px",
          }}
        >
          {chat.length > 0 ? (
            chat.map((message, index) => (
              <div
                key={index}
                style={{
                  alignSelf: message.from === email ? "flex-end" : "flex-start",
                  backgroundColor:
                    message.from === email ? "#d1e7dd" : "#f8d7da",
                  padding: "10px",
                  borderRadius: "10px",
                  marginBottom: "8px",
                  maxWidth: "75%",
                  wordWrap: "break-word",
                  
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.8em",
                      fontWeight: "bold",
                      color: "#495057",
                    }}
                  >
                    {message.from === email ? "You" : message.fromName}
                  </span>
                  <span
                    style={{
                      fontSize: "0.7em",
                      color: "#6c757d",
                    }}
                  >
                    {new Date(message.createAt).toLocaleString()}
                  </span>
                </div>
                <div>{message.text}</div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted">No messages yet.</p>
          )}
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            placeholder="Type a message..."
            style={{
              flexGrow: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ced4da",
            }}
          />
          <button
            onClick={handleSendMessage}
            style={{
              padding: "10px 16px",
              backgroundColor: "#0d6efd",
              color: "white",
              border: "none",
              borderRadius: "8px",
            }}
          >
            Send
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ChatModal;



// import React, { useState, useEffect, useRef, useContext } from "react";
// import { v4 as uuidv4 } from "uuid";
// import { Form, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { Button, Modal } from "react-bootstrap";
// import { AttendanceContext } from "../../../../Context/AttendanceContext/AttendanceContext";
// import { useTheme } from "../../../../Context/TheamContext/ThemeContext";

// const UpdateTask = ({ show, onHide, task, onUpdate }) => {
//   const { socket, setChat, chat } = useContext(AttendanceContext);
//   const { userData } = useSelector((state) => state.user);
//   const chatw = useSelector((state) => state.chat);

//   const { taskId, to, profile, taskName } = chatw;

//   const email = userData?.Email;
//   const name = `${userData?.FirstName} ${userData?.LastName}`;
//   const [newMessage, setNewMessage] = useState("");
//   const messagesEndRef = useRef(null);
//   const chatContainerRef = useRef(null);
//   const location = useLocation().pathname.split("/")[2];
//   const notiId = uuidv4();
//   const { darkMode } = useTheme();

//   useEffect(() => {
//     socket.emit(
//       "getMessages",
//       {
//         from: email,
//         to: to,
//         taskId: taskId,
//         bwt: "admin-manager",
//       },
//       (data) => {
//         setChat(data);
//       }
//     );
//   }, [socket, email, taskId, to, setChat]);

//   const handleSendMessage = () => {
//     if (!newMessage.trim()) {
//       return;
//     }

//     const timestamp = new Date().toISOString();

//     socket.emit("sendMessage", {
//       notiId,
//       profile: profile ? profile.image_url : null,
//       from: email,
//       taskName,
//       to: to,
//       taskId: taskId,
//       text: newMessage,
//       name: name,
//       createAt: timestamp,
//       bwt: "admin-manager",
//     });

//     setChat((prevChat) => [
//       ...prevChat,
//       { text: newMessage, from: email, fromName: name, createAt: timestamp },
//     ]);
//     setNewMessage("");
//   };

//   useEffect(() => {
//     socket.on("newMessage", (data) => {
//       if (location === data.path && taskId === data.taskIden) {
//         setChat((prevChat) => [...prevChat, data]);
//       }
//     });

//     return () => {
//       socket.off("newMessage");
//     };
//   }, [socket, location, setChat]);

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop =
//         chatContainerRef.current.scrollHeight;
//     }
//   }, [chat]);

//   const formatDate = (timestamp) => {
//     try {
//       if (!timestamp) return "Invalid Date";
//       const date = new Date(timestamp);
//       if (isNaN(date.getTime())) return "Invalid Date"; // Check for invalid date

//       const today = new Date();
//       if (date.toDateString() === today.toDateString()) {
//         // If the date is today, show only the time
//         return date.toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         });
//       } else {
//         // If the date is not today, show the date (month and day) and the time
//         return (
//           date.toLocaleDateString(undefined, {
//             month: "short",
//             day: "numeric",
//           }) +
//           " " +
//           date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//         );
//       }
//     } catch (error) {
//       console.error("Error parsing date:", error);
//       return "Invalid Date";
//     }
//   };

//   return (
 
//     <Modal show={show} onHide={onHide}>
//     <Modal.Header closeButton>
//       <Modal.Title>Update Task</Modal.Title>
//     </Modal.Header>
//     <Modal.Body>
//       {/* <Form>
//         <Form.Group controlId="formTaskName">
//           <Form.Label>Task Name</Form.Label>
//           <Form.Control
//             type="text"
          
//           />
//         </Form.Group>
//         <Form.Group controlId="formTaskDescription">
//           <Form.Label>Task Description</Form.Label>
//           <Form.Control
//             as="textarea"
//             rows={3}
           
//           />
//         </Form.Group>
//         <Form.Group controlId="formTaskStartDate">
//           <Form.Label>Start Date</Form.Label>
//           <Form.Control
//             type="date"
           
//           />
//         </Form.Group>
//         <Form.Group controlId="formTaskEndDate">
//           <Form.Label>End Date</Form.Label>
//           <Form.Control
//             type="date"
           
//           />
//         </Form.Group>
//         <Form.Group controlId="formTaskDuration">
//           <Form.Label>Task Duration (in days)</Form.Label>
//           <Form.Control
//             type="number"
//           />
//         </Form.Group>
//         <Form.Group controlId="formTaskManagerEmail">
//           <Form.Label>Manager Email</Form.Label>
//           <Form.Control
//             type="email"
            
//           />
//         </Form.Group>
//         <Form.Group controlId="formTaskComment">
//           <Form.Label>Comment</Form.Label>
//           <Form.Control
//             as="textarea"
//             rows={3}
           
//           />
//         </Form.Group>
//       </Form> */}
//        {chat.length > 0 ? (
//           <div
//             ref={chatContainerRef}
//             style={{
//               overflow: "auto",
//               maxHeight: "77vh",
//               padding: "16px",
//               display: "flex",
//               flexDirection: "column",
//               gap: "8px",
//               overflowY: "scroll",
//             }}
//           >
//             {chat.map((message, index) => (
//               <div
//                 key={index}
//                 style={{
//                   alignSelf: message.from === email ? "flex-end" : "flex-start",
//                   backgroundColor:
//                     message.from === email ? "#d1e7dd" : "#f8d7da",
//                   padding: "10px",
//                   borderRadius: "5px",
//                   maxWidth: "80%",
//                   wordWrap: "break-word",
//                   position: "relative",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom: "0px",
//                     gap: "20px",
//                   }}
//                 >
//                   <span
//                     style={{
//                       fontSize: "0.7em",
//                       color: "#6c757d",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     {message.from === email ? "You" : message.fromName}
//                   </span>
//                   <span style={{ fontSize: "0.6em", color: "#6c757d" }}>
//                     {formatDate(message.createAt)}
//                   </span>
//                 </div>
//                 <div className="text-dark">{message.text}</div>
//               </div>
//             ))}
//             <div ref={messagesEndRef} />
//           </div>
//         ) : (
//           <div className="text-center py-3">Start new conversation</div>
//         )}

//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "16px",
//             padding: "8px",
//           }}
//         >
//           <input
//             style={{
//               flexGrow: "1",
//               padding: "8px",
//               borderRadius: "4px",
//               border: "1px solid #ced4da",
//             }}
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 handleSendMessage();
//               }
//             }}
//             placeholder="Type a message..."
//           />
//           <button
//             style={{
//               padding: "8px 16px",
//               backgroundColor: "#0d6efd",
//               border: "none",
//               borderRadius: "4px",
//               color: "white",
//               cursor: "pointer",
//             }}
//             onClick={handleSendMessage}
//           >
//             Send
//           </button>
//         </div>
//     </Modal.Body>
//     <Modal.Footer>
//       <Button variant="secondary" onClick={onHide}>
//         Close
//       </Button>
//       <Button variant="primary"  onClick={handleSendMessage} >
//         Send
//       </Button>
//     </Modal.Footer>
//   </Modal>

//     // <div
//     //   style={{
//     //     color: darkMode
//     //       ? "var(--primaryDashColorDark)"
//     //       : "var(--secondaryDashMenuColor)",
//     //   }}
//     //   className="container-fluid py-2"
//     // >
//     //   <div
//     //     style={{
//     //       display: "flex",
//     //       justifyContent: "space-between",
//     //       alignItems: "center",
//     //       gap: "16px",
//     //     }}
//     //   >
//     //     <TittleHeader
//     //       title={taskName}
//     //       // message={"You can chat with your team related with current Task"}
//     //     />
//     //   </div>
//     //   <div
//     //     style={{
//     //       // border: "1px solid black",
//     //       width: "100%",
//     //       flexDirection: "column",
//     //       display: "flex",
//     //       flex: "1",
//     //       minHeight: "80vh",
//     //       justifyContent: "end",
//     //       backgroundImage: darkMode
//     //         ? "url(https://www.shutterstock.com/image-vector/social-media-doodle-seamless-pattern-600nw-1931497916.jpg)"
//     //         : "url(https://i.pinimg.com/originals/b9/1d/c2/b91dc2113881469c07ac99ad9a024a01.jpg)",

//     //       backgroundPosition: "center",
//     //       backgroundSize: "250px",
//     //       backgroundRepeat: "repeat",
//     //     }}
//     //   >
//     //     {chat.length > 0 ? (
//     //       <div
//     //         ref={chatContainerRef}
//     //         style={{
//     //           overflow: "auto",
//     //           maxHeight: "77vh",
//     //           padding: "16px",
//     //           display: "flex",
//     //           flexDirection: "column",
//     //           gap: "8px",
//     //           overflowY: "scroll",
//     //         }}
//     //       >
//     //         {chat.map((message, index) => (
//     //           <div
//     //             key={index}
//     //             style={{
//     //               alignSelf: message.from === email ? "flex-end" : "flex-start",
//     //               backgroundColor:
//     //                 message.from === email ? "#d1e7dd" : "#f8d7da",
//     //               padding: "10px",
//     //               borderRadius: "5px",
//     //               maxWidth: "80%",
//     //               wordWrap: "break-word",
//     //               position: "relative",
//     //             }}
//     //           >
//     //             <div
//     //               style={{
//     //                 display: "flex",
//     //                 justifyContent: "space-between",
//     //                 alignItems: "center",
//     //                 marginBottom: "0px",
//     //                 gap: "20px",
//     //               }}
//     //             >
//     //               <span
//     //                 style={{
//     //                   fontSize: "0.7em",
//     //                   color: "#6c757d",
//     //                   fontWeight: "bold",
//     //                 }}
//     //               >
//     //                 {message.from === email ? "You" : message.fromName}
//     //               </span>
//     //               <span style={{ fontSize: "0.6em", color: "#6c757d" }}>
//     //                 {formatDate(message.createAt)}
//     //               </span>
//     //             </div>
//     //             <div className="text-dark">{message.text}</div>
//     //           </div>
//     //         ))}
//     //         <div ref={messagesEndRef} />
//     //       </div>
//     //     ) : (
//     //       <div className="text-center py-3">Start new conversation</div>
//     //     )}

//     //     <div
//     //       style={{
//     //         display: "flex",
//     //         alignItems: "center",
//     //         gap: "16px",
//     //         padding: "8px",
//     //       }}
//     //     >
//     //       <input
//     //         style={{
//     //           flexGrow: "1",
//     //           padding: "8px",
//     //           borderRadius: "4px",
//     //           border: "1px solid #ced4da",
//     //         }}
//     //         type="text"
//     //         value={newMessage}
//     //         onChange={(e) => setNewMessage(e.target.value)}
//     //         onKeyDown={(e) => {
//     //           if (e.key === "Enter") {
//     //             handleSendMessage();
//     //           }
//     //         }}
//     //         placeholder="Type a message..."
//     //       />
//     //       <button
//     //         style={{
//     //           padding: "8px 16px",
//     //           backgroundColor: "#0d6efd",
//     //           border: "none",
//     //           borderRadius: "4px",
//     //           color: "white",
//     //           cursor: "pointer",
//     //         }}
//     //         onClick={handleSendMessage}
//     //       >
//     //         Send
//     //       </button>
//     //     </div>
//     //   </div>
//     // </div>
//   );
// };

// export default UpdateTask;

