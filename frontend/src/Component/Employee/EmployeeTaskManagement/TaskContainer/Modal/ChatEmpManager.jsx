import React, { useState, useEffect, useRef, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ChatbgDark from "../../../../../img/Chat/ChatbgDark.png";
import ChatbgLight from "../../../../../img/Chat/ChatbgLight.jpg";
import { MdSend } from "react-icons/md";
import { AttendanceContext } from "../../../../../Context/AttendanceContext/AttendanceContext";
import { useTheme } from "../../../../../Context/TheamContext/ThemeContext";
import TittleHeader from "../../../../../Pages/TittleHeader/TittleHeader";

const ChatEmpManager = () => {
  const { messageData, socket, setChat, chat } = useContext(AttendanceContext);
  const { userData } = useSelector((state) => state.user);

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

  const backgroundStyle = darkMode
    ? `url(${ChatbgLight})`
    : `url(${ChatbgDark})`;

  return (


    <div
      className="card-body p-0"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        className="chat chat-messages show flex-grow-1"
        style={{ overflowY: "auto", padding: "1rem", height: "45vh" }}
      >
        <div
          ref={chatContainerRef}
          style={{
            overflow: "auto",
            maxHeight: "77vh",
            padding: ".5rem",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >

          {chat.map((message, index) => (
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
          ))}

        </div>
      </div>
      <div
        className="chat-footer"
        style={{ background: darkMode ? "#F8F9FA" : "#161515f6",
          color: darkMode ? "#3c3c3c" : "#f2f2f2", padding: "10px" }}
      >
        <div className="footer-form">
          <div className="chat-footer-wrap d-flex align-items-center gap-2">
            <div className="form-wrap flex-grow-1">
              <input
                type="text"
                className={`form-control ms-0 ms-md-auto rounded-2 ${
                  darkMode
                    ? "bg-light text-dark border dark-placeholder"
                    : "bg-dark text-light border-0 light-placeholder"
                }`}                placeholder="Type Your Message...."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
              />
            </div>
            <div className="form-btn">
              <button className="btn btn-primary" type="submit"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ChatEmpManager;
