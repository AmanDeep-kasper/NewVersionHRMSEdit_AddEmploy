export const rowHeadStyle = (darkMode) => ({
  verticalAlign: "middle",
  whiteSpace: "pre",
  background: darkMode ? "rgb(238, 238, 238)" : "rgb(43, 44, 44)",
  color: darkMode ? "#535862" : "#f2f2f2",
  border: "none",
  position: "sticky",
  top: "0rem",
  zIndex: "2",
});

export const rowBodyStyle = (darkMode) => ({
  verticalAlign: "middle",
  whiteSpace: "pre",

  background: darkMode ? "transparent" : "rgb(35, 36, 36)",
  color: darkMode
    ? "var(--secondaryDashColorDark)"
    : "var(--primaryDashMenuColor)",
  borderBottom: "1px solid rgba(0,0,0,.08)",
});
