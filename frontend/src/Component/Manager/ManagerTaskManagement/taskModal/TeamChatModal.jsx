import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap"; // Using Bootstrap modal
import { AttendanceContext } from "../../../../Context/AttendanceContext/AttendanceContext";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useTheme } from "../../../../Context/TheamContext/ThemeContext";
import { useLocation } from "react-router-dom";

const ChatModal = ({ task, onClose }) => {
    const { messageData, socket, setChat, chat } = useContext(AttendanceContext);
    const { userData } = useSelector((state) => state.user);
    console.log(task);
    
  
    const chatw = useSelector((state) => state.chat);
  
    const { taskId, to, profile, name, taskName } = chatw;
  
    const email = userData?.Email;
    // const name = `${userData?.FirstName} ${userData?.LastName}`;

    const [newMessage, setNewMessage] = useState("");
    const chatContainerRef = useRef(null);
    const location = useLocation().pathname.split("/")[2];
    const { darkMode } = useTheme();
  
    const notiId = uuidv4();
  
    useEffect(() => {
      socket.emit(
        "getMessages",
        {
          from: email,
          to: to,
          taskId: taskId,
          bwt: "emp-manager",
        },
        (data) => {
          setChat(data);
        }
      );
      return () => {
        socket.off("getMessages");
      };
    }, [socket, email, taskId, to]);
  
    const handleSendMessage = () => {
      if (!newMessage.trim()) {
        return;
      }
  
      socket.emit("sendMessage", {
        from: email,
        taskName,
        to: to,
        taskId: taskId,
        name: name,
        notiId,
        profile: profile ? profile.image_url : null,
        text: newMessage,
        bwt: "emp-manager",
      });
  
      setChat((prevChat) => [
        ...prevChat,
        {
          text: newMessage,
          from: email,
          fromName: name,
          createAt: new Date().toISOString(),
        },
      ]);
      setNewMessage("");
    };
  
    useEffect(() => {
      socket.on("newMessage", (data) => {
        if (location === data.path && taskId === data.taskIden) {
          setChat((prevChat) => [...prevChat, data]);
        }
      });
  
      return () => {
        socket.off("newMessage");
      };
    }, [socket, location, setChat]);
  
    useEffect(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }, [chat]);
  
    const formatDate = (timestamp) => {
      try {
        if (!timestamp) return "Invalid Date";
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return "Invalid Date"; // Check for invalid date
  
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
          // If the date is today, show only the time
          return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        } else {
          // If the date is not today, show the date (month and day) and the time
          return (
            date.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            }) +
            " " +
            date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          );
        }
      } catch (error) {
        console.error("Error parsing date:", error);
        return "Invalid Date";
      }
    };


  return (
    <Modal
      show={true}
      onHide={onClose}
      centered
      size="lg"
      style={{ maxWidth: "90%", margin: "auto" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Chat About Task: {task.Taskname}</Modal.Title>
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
            //   <div
            //     key={index}
            //     style={{
            //       alignSelf: message.from === email ? "flex-end" : "flex-start",
            //       backgroundColor:
            //         message.from === email ? "#d1e7dd" : "#f8d7da",
            //       padding: "10px",
            //       borderRadius: "10px",
            //       marginBottom: "8px",
            //       maxWidth: "75%",
            //       wordWrap: "break-word",
                  
            //     }}
            //   >
            //     <div
            //       style={{
            //         display: "flex",
            //         justifyContent: "space-between",
            //         alignItems: "center",
            //       }}
            //     >
            //       <span
            //         style={{
            //           fontSize: "0.8em",
            //           fontWeight: "bold",
            //           color: "#495057",
            //         }}
            //       >
            //         {message.from === email ? "You" : message.fromName}
            //       </span>
            //       <span
            //         style={{
            //           fontSize: "0.7em",
            //           color: "#6c757d",
            //         }}
            //       >
            //         {new Date(message.createAt).toLocaleString()}
            //       </span>
            //     </div>
            //     <div>{message.text}</div>
            //   </div>
            <div
            key={index}
            style={{
              alignSelf: message.from === email ? "flex-end" : "flex-start",
              backgroundColor: message.from === email ? "#d1e7dd" : "#f8d7da",
              padding: "10px",
              borderRadius: "5px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0px",
                gap: "20px",
              }}
            >
              <span
                style={{
                  fontSize: "0.7rem",
                  color: "#6c757d",
                  fontWeight: "bold",
                }}
              >
                {message.from === email ? "You" : message.fromName}
              </span>
              <span style={{ fontSize: "0.7rem", color: "#6c757d" }}>
                {formatDate(message.createAt)}
              </span>
            </div>
            <div className="text-dark">{message.text}</div>
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
              if (e.key === "Enter") {
                handleSendMessage();
              }
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
            Send afroz
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ChatModal;
