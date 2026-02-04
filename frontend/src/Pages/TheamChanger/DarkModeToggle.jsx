// import React from "react";
// import "../../index.css";
// import { MdDarkMode, MdLightMode } from "react-icons/md";
// import "./DarModeTheam.css";
// import { useTheme } from "../../Context/TheamContext/ThemeContext";

// function DarkModeToggle() {
//   // Use the global darkMode state and toggleTheme function from the context
//   const { darkMode, toggleTheme } = useTheme();

//   return (
//     <div>
//       <span
//         className="position-relative keyframe rounded-5 bg-primary gap-2 d-flex"
//         style={{ scale: ".6", boxShadow: "0 0 3px 2px white" }}
//       >
//         {/* Icon for dark mode */}
//         <span
//           className="fs-4 p-1 my-auto keyframe"
//           style={{
//             display: darkMode ? "inline" : "none",
//             scale: "1.3",
//             whiteSpace: "pre",
//           }}
//         >
//           <MdDarkMode className="text-warning pb-1" />
//         </span>

//         {/* Button to toggle theme */}
//         <button
//           onClick={toggleTheme}
//           style={{
//             border: darkMode ? ".6rem solid black" : ".6rem solid white",
//             outline: "none",
//             backgroundColor: darkMode ? "#000000" : "#ffffff",
//             color: darkMode ? "#ffffff" : "#000000",
//             scale: "1.1",
//           }}
//           className="px-2 fw-bolder text-capitalize rounded-5 shadow my-auto"
//         >
//           {darkMode ? "Dark" : "Light"}
//         </button>

//         {/* Icon for light mode */}
//         <span
//           className="fs-4 p-1 my-auto"
//           style={{
//             display: darkMode ? "none" : "inline",
//             scale: "1.3",
//             whiteSpace: "pre",
//           }}
//         >
//           <MdLightMode className="text-warning pb-1 mx-1 keyframe" />
//         </span>
//       </span>
//     </div>
//   );
// }

// export default DarkModeToggle;
import React from "react";
import "../../index.css";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import "./DarModeTheam.css";
import { useTheme } from "../../Context/TheamContext/ThemeContext";

function DarkModeToggle() {
  // Use the global darkMode state and toggleTheme function from the context
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div style={{ cursor: "pointer" }} className="toggle-container">
      <span
        className={`toggle-switch ${darkMode ? "dark" : "light"}`}
        onClick={toggleTheme}
      >
        {/* Icon for dark mode */}
        <span className="icon">
          {darkMode ? (
            <MdDarkMode className="text-dark fs-4" />
          ) : (
            <MdLightMode className="text-light fs-4" />
          )}
        </span>
      </span>
    </div>
  );
}

export default DarkModeToggle;
