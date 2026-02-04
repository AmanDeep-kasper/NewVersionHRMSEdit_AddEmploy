import { useState, useEffect } from "react";
import { FaPlus, FaStar } from "react-icons/fa";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { useShowStickey } from "../../../Context/ShowStickeyContext/ShowStickeyContext";
import { useSelector } from "react-redux";
import axios from "axios";
import "./StickyNotes.css";
import { getTimeAgo } from "../../GetDayFormatted";
import { useTheme } from "../../../Context/TheamContext/ThemeContext";
import { Rnd } from "react-rnd";
import api from "../../../Pages/config/api";

const StickyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [selectedColor, setSelectedColor] = useState("#ff7eb9");
  const [searchTerm, setSearchTerm] = useState("");
  const { isVisible, toggleVisibilityStickey } = useShowStickey();
  const { userData } = useSelector((state) => state.user);
  const { darkMode } = useTheme();

useEffect(() => {
  const fetchNotes = async () => {
    if (!userData?._id) return; // Only fetch if userData is available
    try {
      const response = await api.get(
        `/api/sticky-notes/${userData._id}`,
      );

      const sortedNotes = response.data.sort((a, b) => {
        if (a.isStarred && !b.isStarred) return -1;
        if (!a.isStarred && b.isStarred) return 1;
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });

      setNotes(sortedNotes);
    } catch (error) {
      // Only show toast if error is not due to missing userData
      if (userData?._id) {
        console.error("Error fetching notes:", error);
        // toast.error(error?.response?.data?.message || "Failed to load notes");
      }
    }
  };

  fetchNotes();
}, [userData?._id]);

// ...existing code...
const addNote = async () => {
  try {
    const newNote = {
      text: "New Note",
      color: selectedColor,
      isStarred: false,
      user: userData._id,
      x: notes.length * 20, // Default x position
      y: notes.length * 20, // Default y position
      width: 260, // Default width
      height: 240, // Default height
    };

    const response = await api.post(`/api/sticky-notes`, newNote, {
    });

    setNotes((prevNotes) => [...prevNotes, response.data]);
    alert("New note added!");
  } catch (error) {
    console.error("Error adding note:", error);
    alert(error?.response?.data?.message || "Failed to add note");
  }
};

// ✅ Update note position and size
const updateNotePosition = async (id, x, y, width, height) => {
  try {
    await api.put(
      `/api/sticky-notes/${id}/position`,
      { x, y, width, height },
    );

    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === id ? { ...note, x, y, width, height } : note
      )
    );
  } catch (error) {
    console.error("Error updating note position:", error);
  }
};

// ✅ Update note text
const handleBlur = async (id, newText) => {
  try {
    const updatedNote = await axios.put(
      `/api/sticky-notes/${id}`,
      { text: newText },
    );

    setNotes((prevNotes) =>
      prevNotes.map((note) => (note._id === id ? updatedNote.data : note))
    );
  } catch (error) {
    console.error("Error updating note:", error);
  }
};

// ✅ Toggle Star
const toggleStar = async (id) => {
  try {
    const note = notes.find((n) => n._id === id);
    const updatedNote = await api.put(
      `/api/sticky-notes/${id}`,
      { isStarred: !note.isStarred },
    );

    const updatedNotes = notes
      .map((note) => (note._id === id ? updatedNote.data : note))
      .sort((a, b) => {
        if (a.isStarred && !b.isStarred) return -1;
        if (!a.isStarred && b.isStarred) return 1;
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });

    setNotes(updatedNotes);
  } catch (error) {
    console.error("Error toggling star:", error);
  }
};

// ✅ Delete Note
const deleteNote = async (id) => {
  if (!window.confirm("Are you sure you want to delete this note?")) return;

  try {
    await api.delete(`/api/sticky-notes/${id}`, {
    });

    setNotes(notes.filter((note) => note._id !== id));
    alert("Note deleted successfully");
  } catch (error) {
    console.error("Error deleting note:", error);
    alert(error?.response?.data?.message || "Failed to delete note");
  }
};


  // Filter notes based on the search term
  const filteredNotes = notes.filter(
    (note) =>
      note.text && note.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {isVisible && (
        <div
          style={{
            height: "100vh",
            width: "100%",
            position: "absolute",
            top: "0",
            left: "0",
            zIndex: "10000",
          }}
          className="sticky-notes-container bg-white d-flex"
        >
          <div
            style={{
              height: "100%",
              width: "fit-content",
              borderLeft: "1px solid rgba(0,0,0,.1)",
              background: "#F9F6EE",
            }}
            className="p-3 d-flex flex-column align-items-center justify-content-between gap-3"
          >
            <div className="p-3 d-flex flex-column align-items-center gap-3">
              <span
                style={{
                  height: "2rem",
                  width: "2rem",
                  borderRadius: "50%",
                  background: "black",
                  cursor: "pointer",
                }}
                className="d-flex align-items-center justify-content-center"
                onClick={addNote}
              >
                <FaPlus className="fs-5 text-white" />
              </span>

              {["#ff7eb9", "#ff65a3", "#7afcff", "#feff9c", "#fff740"].map(
                (color) => (
                  <span
                    key={color}
                    style={{
                      height: "1.1rem",
                      width: "1.1rem",
                      borderRadius: "50%",
                      background: color,
                      cursor: "pointer",
                      border:
                        selectedColor === color ? "2px solid black" : "none",
                    }}
                    onClick={() => setSelectedColor(color)}
                  ></span>
                )
              )}
            </div>
            <span
              style={{ cursor: "pointer" }}
              title="Sticky Notes"
              onClick={toggleVisibilityStickey}
            >
              <MdClose style={{ color: "black" }} className="fs-2" />
            </span>
          </div>
          <div className="d-flex flex-column gap-2 p-2 w-100">
            <input
              type="text"
              placeholder="Search notes..."
              className={`form-control  rounded-2 ${
                darkMode
                  ? "bg-light text-dark border dark-placeholder"
                  : "bg-dark text-light border-0 light-placeholder"
              }`}
              style={{
                width: "15rem",
                border: "1px solid #ccc",
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div
              style={{
                height: "88vh",
                width: "100%",
                overflow: "auto",
                display: "row",
                gap: "10px",
              }}
              className="row mx-auto p-3  d-md-none"
            >
              {filteredNotes.map((note) => (
                <div
                  className="col-12"
                  key={note._id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    border: "1px solid #ddd",
                    padding: "10px",
                    borderRadius: "5px",
                    height: "fit-content",
                    backgroundColor: note.color,
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <span>{getTimeAgo(note.updatedAt)}</span>
                    <div className="d-flex align-items-center gap-2">
                      <FaStar
                        className="fs-5"
                        style={{
                          cursor: "pointer",
                          filter: "drop-shadow(2px 2px 0px rgba(0, 0, 0, .2))",
                          color: note.isStarred ? "#FEBE10" : "white",
                        }}
                        onClick={() => toggleStar(note._id)}
                      />
                      <span
                        style={{
                          height: "2rem",
                          width: "2rem",
                          cursor: "pointer",
                        }}
                        className="d-flex align-items-center justify-content-center"
                        onClick={() => deleteNote(note._id)}
                      >
                        <IoMdRemoveCircleOutline
                          style={{
                            filter:
                              "drop-shadow(2px 2px 0px rgba(0, 0, 0, .2))",
                          }}
                          className="fs-4 text-danger"
                        />
                      </span>
                    </div>
                  </div>

                  <textarea
                    value={note.text}
                    onChange={(e) => {
                      const updatedText = e.target.value;
                      setNotes((prevNotes) =>
                        prevNotes.map((n) =>
                          n._id === note._id ? { ...n, text: updatedText } : n
                        )
                      );
                    }}
                    onBlur={(e) => handleBlur(note._id, e.target.value)}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      backgroundColor: "transparent",
                      resize: "none",
                      outline: "none",
                    }}
                  />
                </div>
              ))}
            </div>

            <div
              style={{
                height: "88vh",
                width: "100%",
                overflow: "auto",
                position: "relative",
              }}
              className="d-none d-md-flex"
            >
              {filteredNotes.map((note) => (
                <Rnd
                  key={note._id}
                  default={{
                    x: note.x || 0,
                    y: note.y || 0,
                    width: note.width || 260,
                    height: note.height || 240,
                  }}
                  minWidth={260}
                  minHeight={240}
                  bounds="parent"
                  style={{
                    backgroundColor: note.color,
                    padding: "10px",
                    borderRadius: "5px",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  }}
                  onDragStop={(e, d) => {
                    updateNotePosition(
                      note._id,
                      d.x,
                      d.y,
                      note.width,
                      note.height
                    );
                  }}
                  onResizeStop={(e, direction, ref, delta, position) => {
                    updateNotePosition(
                      note._id,
                      position.x,
                      position.y,
                      ref.style.width,
                      ref.style.height
                    );
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <span>{getTimeAgo(note.updatedAt)}</span>
                      <div className="d-flex align-items-center gap-2">
                        <FaStar
                          className="fs-5"
                          style={{
                            cursor: "pointer",
                            filter:
                              "drop-shadow(2px 2px 0px rgba(0, 0, 0, .2))",
                            color: note.isStarred ? "#FEBE10" : "white",
                          }}
                          onClick={() => toggleStar(note._id)}
                        />
                        <span
                          style={{
                            height: "2rem",
                            width: "2rem",
                            cursor: "pointer",
                          }}
                          className="d-flex align-items-center justify-content-between"
                          onClick={() => deleteNote(note._id)}
                        >
                          <IoMdRemoveCircleOutline
                            style={{
                              filter:
                                "drop-shadow(2px 2px 0px rgba(0, 0, 0, .2))",
                            }}
                            className="fs-4 text-danger"
                          />
                        </span>
                      </div>
                    </div>

                    <textarea
                      value={note.text}
                      onChange={(e) => {
                        const updatedText = e.target.value;
                        setNotes((prevNotes) =>
                          prevNotes.map((n) =>
                            n._id === note._id ? { ...n, text: updatedText } : n
                          )
                        );
                      }}
                      onBlur={(e) => handleBlur(note._id, e.target.value)}
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        backgroundColor: "transparent",
                        resize: "none",
                        outline: "none",
                      }}
                    />
                  </div>
                </Rnd>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StickyNotes;
