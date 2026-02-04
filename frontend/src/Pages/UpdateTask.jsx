import React, { useState, useEffect, useRef, useContext } from "react";
import { AttendanceContext } from "../Context/AttendanceContext/AttendanceContext";
import { v4 as uuidv4 } from "uuid";
import { useLocation } from "react-router-dom";
import { useTheme } from "../Context/TheamContext/ThemeContext";
import TittleHeader from "./TittleHeader/TittleHeader";
import { useSelector } from "react-redux";

const UpdateTask = () => {
  const { socket, setChat, chat } = useContext(AttendanceContext);
  const { userData } = useSelector((state) => state.user);
  const chatw = useSelector((state) => state.chat);

  const { taskId, to, profile, taskName } = chatw;

  const email = userData?.Email;
  const name = `${userData?.FirstName} ${userData?.LastName}`;
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const location = useLocation().pathname.split("/")[2];
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
    if (!newMessage.trim()) {
      return;
    }

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
    <div
      style={{
        color: darkMode
          ? "var(--primaryDashColorDark)"
          : "var(--secondaryDashMenuColor)",
      }}
      className="container-fluid py-2"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <TittleHeader
          title={taskName}
          // message={"You can chat with your team related with current Task"}
        />
      </div>
      <div
        style={{
          // border: "1px solid black",
          width: "100%",
          flexDirection: "column",
          display: "flex",
          flex: "1",
          minHeight: "80vh",
          justifyContent: "end",
          backgroundImage: darkMode
            ? "url(https://www.shutterstock.com/image-vector/social-media-doodle-seamless-pattern-600nw-1931497916.jpg)"
            : "url(https://i.pinimg.com/originals/b9/1d/c2/b91dc2113881469c07ac99ad9a024a01.jpg)",

          backgroundPosition: "center",
          backgroundSize: "250px",
          backgroundRepeat: "repeat",
        }}
      >
        {chat.length > 0 ? (
          <div
            ref={chatContainerRef}
            style={{
              overflow: "auto",
              maxHeight: "77vh",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              overflowY: "scroll",
            }}
          >
            {chat.map((message, index) => (
              <div
                key={index}
                style={{
                  alignSelf: message.from === email ? "flex-end" : "flex-start",
                  backgroundColor:
                    message.from === email ? "#d1e7dd" : "#f8d7da",
                  padding: "10px",
                  borderRadius: "5px",
                  maxWidth: "80%",
                  wordWrap: "break-word",
                  position: "relative",
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
                      fontSize: "0.7em",
                      color: "#6c757d",
                      fontWeight: "bold",
                    }}
                  >
                    {message.from === email ? "You" : message.fromName}
                  </span>
                  <span style={{ fontSize: "0.6em", color: "#6c757d" }}>
                    {formatDate(message.createAt)}
                  </span>
                </div>
                <div className="text-dark">{message.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="text-center py-3">Start new conversation</div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "8px",
          }}
        >
          <input
            style={{
              flexGrow: "1",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ced4da",
            }}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
          />
          <button
            style={{
              padding: "8px 16px",
              backgroundColor: "#0d6efd",
              border: "none",
              borderRadius: "4px",
              color: "white",
              cursor: "pointer",
            }}
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTask;
