import React, { useState } from "react";
import { FaTools } from "react-icons/fa";
import { useShowHide } from "../../Context/ShowHideContext/ShowHideContext";
import { FcCalculator } from "react-icons/fc";
import { FaNoteSticky } from "react-icons/fa6";
import { GrClose } from "react-icons/gr";
import { useShowStickey } from "../../Context/ShowStickeyContext/ShowStickeyContext";

const ToolMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };
  const { toggleVisibility } = useShowHide();
  const { toggleVisibilityStickey } = useShowStickey();

  return (
    <div>
      <div
        style={{
          height: "3rem",
          width: "3rem",
          backgroundImage: "linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)",
          borderRadius: "50%",
          position: "fixed",
          zIndex: "1000000",
          bottom: "2.5rem",
          right: "4.5rem",
          cursor: "pointer",
        }}
        onClick={toggleMenu}
        className="d-flex align-items-center justify-content-center"
      >
        {" "}
        {!isOpen ? (
          <FaTools className="fs-4 text-white" />
        ) : (
          <GrClose className="fs-4 text-white" />
        )}
        {isOpen && (
          <div>
            <div
              style={{
                height: "2.5rem",
                width: "2.5rem",
                backgroundImage:
                  "linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)",
                // border: "1px solid gray",
                borderRadius: "50%",
                position: "absolute",
                zIndex: "1000",
                top: "-4rem",
                right: "0",
                cursor: "pointer",
              }}
              onClick={toggleMenu}
              className="d-flex align-items-center  shadow-sm justify-content-center"
            >
              <span title="Calculator" onClick={toggleVisibility}>
                <FcCalculator className="fs-4" />
              </span>
            </div>
            <div
              style={{
                height: "2.5rem",
                width: "2.5rem",
                backgroundImage:
                  "linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)",
                borderRadius: "50%",
                position: "absolute",
                zIndex: "1000",
                top: "-3rem",
                right: "3.5rem",
                cursor: "pointer",
              }}
              className="d-flex align-items-center  shadow-sm justify-content-center"
              onClick={toggleMenu}
            >
              {" "}
              <span title="Stickey Notes" onClick={toggleVisibilityStickey}>
                <FaNoteSticky style={{ color: "#feff9c" }} className="fs-4" />
              </span>
            </div>
            {/* <div
              style={{
                height: "2.5rem",
                width: "2.5rem",
                backgroundImage:
                  "linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)",
                borderRadius: "50%",
                position: "absolute",
                zIndex: "1000",
                top: ".6rem",
                right: "4.3rem",
                cursor: "pointer",
              }}
              className="d-flex align-items-center  shadow-sm justify-content-center"
              onClick={toggleMenu}
            >
              {" "}
              <span title="Todo List" onClick={toggleVisibilityTodo}>
                <FcParallelTasks className="text-white fs-3" />
              </span>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolMenu;
