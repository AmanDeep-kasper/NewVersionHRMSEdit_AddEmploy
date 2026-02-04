

// finsl code main
// AttendanceFilter.jsx
import TittleHeader from "../../../../Pages/TittleHeader/TittleHeader";
import PropTypes from "prop-types";

const AttendanceFilter = ({
  filterYear,
  setFilterYear,
  filterMonth,
  setFilterMonth,
  uniqueYears,
  uniqueMonths,
  getUserStatusColor,
  searchQuery,
  setSearchQuery,
  darkMode,
  isPayrollSend,
  processAttendance,
  page,
  setPage,
  limit,
  setLimit,
  totalPages,
}) => (
  <div className="d-flex justify-content-between py-3">
    <TittleHeader title="Attendance Summary" message="You can view all employee attendance here." />

    <div
      style={{ color: darkMode ? "var(--secondaryDashColorDark)" : "var(--secondaryDashMenuColor)" }}
      className="d-flex gap-3"
    >
      <div className="d-none d-md-flex align-items-center gap-3">
        {/* Year */}
        <div className="d-flex align-items-center gap-2">
          <label className="my-auto">Year</label>
          <select
            className={`form-select rounded-2 ${darkMode ? "bg-light text-dark border dark-placeholder" : "bg-dark text-light border-0 light-placeholder"}`}
            value={filterYear || ""}
            onChange={(e) => {
              const val = e.target.value;
              setFilterYear(val && !isNaN(Number(val)) ? Number(val) : "");
            }}
          >
            <option value="">--Select Year--</option>
            {uniqueYears?.length ? (
              uniqueYears.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))
            ) : (
              <option disabled>No Years Available</option>
            )}
          </select>
        </div>

        {/* Month */}
        <div className="d-flex align-items-center gap-2">
          <label className="my-auto">Month</label>
          <select
            className={`form-select rounded-2 ${darkMode ? "bg-light text-dark border dark-placeholder" : "bg-dark text-light border-0 light-placeholder"}`}
            value={filterMonth || ""}
            onChange={(e) => {
              const val = e.target.value;
              setFilterMonth(val && !isNaN(Number(val)) ? Number(val) : "");
            }}
          >
            <option value="">--Select Month--</option>
            {uniqueMonths?.length ? (
              uniqueMonths.map((month, index) => (
                <option key={index} value={month}>
                  {getUserStatusColor(month)}
                </option>
              ))
            ) : (
              <option disabled>No Months Available</option>
            )}
          </select>
        </div>

        {/* Search */}
        <div className="d-flex">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Pagination controls */}
        {/* <div className="d-flex align-items-center gap-2">
          <label className="my-auto">Page</label>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-outline-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Prev
            </button>
            <span>{page} / {totalPages}</span>
            <button className="btn btn-outline-secondary" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
          <label className="ms-3 my-auto">Show</label>
          <select className="form-select w-auto" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div> */}
      </div>

      {isPayrollSend ? (
        <button className="btn btn-danger my-auto d-flex align-items-center" disabled>
          Salary Processed
        </button>
      ) : (
        <button className="btn btn-success my-auto d-flex align-items-center" onClick={processAttendance} disabled={!!searchQuery}>
          Process Attendance
        </button>
      )}
    </div>

    {/* Mobile controls */}
    <div className="d-flex d-md-none align-items-center gap-3 my-2">
      {/* Year */}
      <div className="d-flex align-items-center gap-2">
        <label className="my-auto">Year</label>
        <select
          className={`form-select rounded-2 ${darkMode ? "bg-light text-dark border dark-placeholder" : "bg-dark text-light border-0 light-placeholder"}`}
          value={filterYear || ""}
          onChange={(e) => {
            const val = e.target.value;
            setFilterYear(val && !isNaN(Number(val)) ? Number(val) : "");
          }}
        >
          <option value="">--Select Year--</option>
          {uniqueYears?.length ? (
            uniqueYears.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))
          ) : (
            <option disabled>No Years Available</option>
          )}
        </select>
      </div>

      {/* Month */}
      <div className="d-flex align-items-center gap-2">
        <label className="my-auto">Month</label>
        <select
          className={`form-select rounded-2 ${darkMode ? "bg-light text-dark border dark-placeholder" : "bg-dark text-light border-0 light-placeholder"}`}
          value={filterMonth || ""}
          onChange={(e) => {
            const val = e.target.value;
            setFilterMonth(val && !isNaN(Number(val)) ? Number(val) : "");
          }}
        >
          <option value="">--Select Month--</option>
          {uniqueMonths?.length ? (
            uniqueMonths.map((month, index) => (
              <option key={index} value={month}>
                {getUserStatusColor(month)}
              </option>
            ))
          ) : (
            <option disabled>No Months Available</option>
          )}
        </select>
      </div>

      {/* Search */}
      <div className="d-flex">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Pagination */}
      <div className="d-flex align-items-center gap-2">
        <label className="my-auto">Page</label>
        <button className="btn btn-outline-secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>{page} / {totalPages}</span>
        <button className="btn btn-outline-secondary" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
        <select className="form-select w-auto" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  </div>
);

AttendanceFilter.propTypes = {
  filterYear: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  setFilterYear: PropTypes.func.isRequired,
  filterMonth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  setFilterMonth: PropTypes.func.isRequired,
  uniqueYears: PropTypes.arrayOf(PropTypes.number).isRequired,
  uniqueMonths: PropTypes.arrayOf(PropTypes.number).isRequired,
  getUserStatusColor: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  darkMode: PropTypes.bool.isRequired,
  isPayrollSend: PropTypes.bool.isRequired,
  processAttendance: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  limit: PropTypes.number.isRequired,
  setLimit: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired,
};

export default AttendanceFilter;

// import TittleHeader from "../../../../Pages/TittleHeader/TittleHeader";
// import PropTypes from "prop-types";

// const AttendanceFilter = ({
//   filterYear,
//   setFilterYear,
//   filterMonth,
//   setFilterMonth,
//   uniqueYears,
//   uniqueMonths,
//   getUserStatusColor,
//   searchQuery,
//   setSearchQuery,
//   darkMode,
//   isPayrollSend,
//   processAttendance,
// }) => (
//   <div className="d-flex justify-content-between py-3">
//     <TittleHeader
//       title="Attendance Summary"
//       message="You can view all employee attendance here."
//     />
//     <div
//       style={{
//         color: darkMode
//           ? "var(--secondaryDashColorDark)"
//           : "var(--secondaryDashMenuColor)",
//       }}
//       className="d-flex gap-3"
//     >
//       <div className="d-none d-md-flex align-items-center gap-3">
//         <div className="d-flex align-items-center gap-2">
//           <label className="my-auto">Year</label>
//           {/* <select
//             className={`form-select rounded-2 ${
//               darkMode
//                 ? "bg-light text-dark border dark-placeholder"
//                 : "bg-dark text-light border-0 light-placeholder"
//             }`}
//             value={filterYear}
//             onChange={(e) => setFilterYear(parseInt(e.target.value))}
//           >
//             <option value="">--Select Year--</option>
//             {uniqueYears
//               .sort((a, b) => a - b)
//               .map((year, index) => (
//                 <option key={index} value={year}>
//                   {year}
//                 </option>
//               ))}
//           </select> */}
//           <select
//   className={`form-select rounded-2 ${
//     darkMode
//       ? "bg-light text-dark border dark-placeholder"
//       : "bg-dark text-light border-0 light-placeholder"
//   }`}
//   value={filterYear || ""}
//   onChange={(e) => {
//     const val = e.target.value;
//     setFilterYear(val && !isNaN(Number(val)) ? Number(val) : "");
//   }}
// >
//   <option value="">--Select Year--</option>
//   {uniqueYears
//     .filter((year) => typeof year === "number" && !isNaN(year))
//     .sort((a, b) => a - b)
//     .map((year, index) => (
//       <option key={index} value={year}>
//         {year}
//       </option>
//     ))}
// </select>
//         </div>
//         <div className="d-flex align-items-center gap-2">
//           <label className="my-auto">Month</label>
//           {/* <select
//             className={`form-select rounded-2 ${
//               darkMode
//                 ? "bg-light text-dark border dark-placeholder"
//                 : "bg-dark text-light border-0 light-placeholder"
//             }`}
//             value={filterMonth}
//             onChange={(e) => setFilterMonth(parseInt(e.target.value))}
//           >
//             <option value="">--Select Month--</option>
//             {uniqueMonths
//               .sort((a, b) => a - b)
//               .map((month, index) => (
//                 <option key={index} value={month}>
//                   {getUserStatusColor(month)}
//                 </option>
//               ))}
//           </select> */}
//           <select
//   className={`form-select rounded-2 ${
//     darkMode
//       ? "bg-light text-dark border dark-placeholder"
//       : "bg-dark text-light border-0 light-placeholder"
//   }`}
//   value={filterMonth || ""}
//   onChange={(e) => {
//     const val = e.target.value;
//     setFilterMonth(val && !isNaN(Number(val)) ? Number(val) : "");
//   }}
// >
//   <option value="">--Select Month--</option>
//   {uniqueMonths
//     .filter((month) => typeof month === "number" && !isNaN(month))
//     .sort((a, b) => a - b)
//     .map((month, index) => (
//       <option key={index} value={month}>
//         {getUserStatusColor(month)}
//       </option>
//     ))}
// </select>
//         </div>
//         <div className="d-flex">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search by name"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>
//       {isPayrollSend ? (
//         <button className="btn btn-danger my-auto d-flex align-items-center" disabled>
//           Salary Processed
//         </button>
//       ) : (
//         <button
//           className="btn btn-success my-auto d-flex align-items-center"
//           onClick={processAttendance}
//           disabled={searchQuery}
//         >
//           Process Attendance
//         </button>
//       )}
//     </div>
//     <div className="d-flex d-md-none align-items-center gap-3 my-2">
//       <div className="d-flex align-items-center gap-2">
//         <label className="my-auto">Year</label>
//         <select
//           className={`form-select rounded-2 ${
//             darkMode
//               ? "bg-light text-dark border dark-placeholder"
//               : "bg-dark text-light border-0 light-placeholder"
//           }`}
//           value={filterYear}
//           onChange={(e) => setFilterYear(parseInt(e.target.value))}
//         >
//           <option value="">--Select Year--</option>
//           {uniqueYears
//             .sort((a, b) => a - b)
//             .map((year, index) => (
//               <option key={index} value={year}>
//                 {year}
//               </option>
//             ))}
//         </select>
//       </div>
//       <div className="d-flex align-items-center gap-2">
//         <label className="my-auto">Month</label>
//         <select
//           className={`form-select rounded-2 ${
//             darkMode
//               ? "bg-light text-dark border dark-placeholder"
//               : "bg-dark text-light border-0 light-placeholder"
//           }`}
//           value={filterMonth}
//           onChange={(e) => setFilterMonth(parseInt(e.target.value))}
//         >
//           <option value="">--Select Month--</option>
//           {uniqueMonths
//             .sort((a, b) => a - b)
//             .map((month, index) => (
//               <option key={index} value={month}>
//                 {getUserStatusColor(month)}
//               </option>
//             ))}
//         </select>
//       </div>
//       <div className="d-flex">
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Search by name"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>
//     </div>
//   </div>
// );

// AttendanceFilter.propTypes = {
//   filterYear: PropTypes.number.isRequired,
//   setFilterYear: PropTypes.func.isRequired,
//   filterMonth: PropTypes.number.isRequired,
//   setFilterMonth: PropTypes.func.isRequired,
//   uniqueYears: PropTypes.arrayOf(PropTypes.number).isRequired,
//   uniqueMonths: PropTypes.arrayOf(PropTypes.number).isRequired,
//   getUserStatusColor: PropTypes.func.isRequired,
//   searchQuery: PropTypes.string.isRequired,
//   setSearchQuery: PropTypes.func.isRequired,
//   darkMode: PropTypes.bool.isRequired,
//   isPayrollSend: PropTypes.bool.isRequired,
//   processAttendance: PropTypes.func.isRequired,
// };

// export default AttendanceFilter;
// semi final
// import TittleHeader from "../../../../Pages/TittleHeader/TittleHeader";
// import PropTypes from "prop-types";

// const AttendanceFilter = ({
//   filterYear,
//   setFilterYear,
//   filterMonth,
//   setFilterMonth,
//   uniqueYears,
//   uniqueMonths,
//   getUserStatusColor,
//   searchQuery,
//   setSearchQuery,
//   darkMode,
//   isPayrollSend,
//   processAttendance,
// }) => (
//   <div className="d-flex justify-content-between py-3">
//     <TittleHeader
//       title="Attendance Summary"
//       message="You can view all employee attendance here."
//     />
//     <div
//       style={{
//         color: darkMode
//           ? "var(--secondaryDashColorDark)"
//           : "var(--secondaryDashMenuColor)",
//       }}
//       className="d-flex gap-3"
//     >
//       <div className="d-none d-md-flex align-items-center gap-3">
//         <div className="d-flex align-items-center gap-2">
//           <label className="my-auto">Year</label>
//           {/* <select
//             className={`form-select rounded-2 ${
//               darkMode
//                 ? "bg-light text-dark border dark-placeholder"
//                 : "bg-dark text-light border-0 light-placeholder"
//             }`}
//             value={filterYear}
//             onChange={(e) => setFilterYear(parseInt(e.target.value))}
//           >
//             <option value="">--Select Year--</option>
//             {uniqueYears
//               .sort((a, b) => a - b)
//               .map((year, index) => (
//                 <option key={index} value={year}>
//                   {year}
//                 </option>
//               ))}
//           </select> */}
//           <select
//   className={`form-select rounded-2 ${
//     darkMode
//       ? "bg-light text-dark border dark-placeholder"
//       : "bg-dark text-light border-0 light-placeholder"
//   }`}
//   value={filterYear || ""}
//   onChange={(e) => {
//     const val = e.target.value;
//     setFilterYear(val && !isNaN(Number(val)) ? Number(val) : "");
//   }}
// >
//   <option value="">--Select Year--</option>
//   {uniqueYears
//     .filter((year) => typeof year === "number" && !isNaN(year))
//     .sort((a, b) => a - b)
//     .map((year, index) => (
//       <option key={index} value={year}>
//         {year}
//       </option>
//     ))}
// </select>
//         </div>
//         <div className="d-flex align-items-center gap-2">
//           <label className="my-auto">Month</label>
//           {/* <select
//             className={`form-select rounded-2 ${
//               darkMode
//                 ? "bg-light text-dark border dark-placeholder"
//                 : "bg-dark text-light border-0 light-placeholder"
//             }`}
//             value={filterMonth}
//             onChange={(e) => setFilterMonth(parseInt(e.target.value))}
//           >
//             <option value="">--Select Month--</option>
//             {uniqueMonths
//               .sort((a, b) => a - b)
//               .map((month, index) => (
//                 <option key={index} value={month}>
//                   {getUserStatusColor(month)}
//                 </option>
//               ))}
//           </select> */}
//           <select
//   className={`form-select rounded-2 ${
//     darkMode
//       ? "bg-light text-dark border dark-placeholder"
//       : "bg-dark text-light border-0 light-placeholder"
//   }`}
//   value={filterMonth || ""}
//   onChange={(e) => {
//     const val = e.target.value;
//     setFilterMonth(val && !isNaN(Number(val)) ? Number(val) : "");
//   }}
// >
//   <option value="">--Select Month--</option>
//   {uniqueMonths
//     .filter((month) => typeof month === "number" && !isNaN(month))
//     .sort((a, b) => a - b)
//     .map((month, index) => (
//       <option key={index} value={month}>
//         {getUserStatusColor(month)}
//       </option>
//     ))}
// </select>
//         </div>
//         <div className="d-flex">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Search by name"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>
//       {isPayrollSend ? (
//         <button className="btn btn-danger my-auto d-flex align-items-center" disabled>
//           Salary Processed
//         </button>
//       ) : (
//         <button
//           className="btn btn-success my-auto d-flex align-items-center"
//           onClick={processAttendance}
//           disabled={searchQuery}
//         >
//           Process Attendance
//         </button>
//       )}
//     </div>
//     <div className="d-flex d-md-none align-items-center gap-3 my-2">
//       <div className="d-flex align-items-center gap-2">
//         <label className="my-auto">Year</label>
//         <select
//           className={`form-select rounded-2 ${
//             darkMode
//               ? "bg-light text-dark border dark-placeholder"
//               : "bg-dark text-light border-0 light-placeholder"
//           }`}
//           value={filterYear}
//           onChange={(e) => setFilterYear(parseInt(e.target.value))}
//         >
//           <option value="">--Select Year--</option>
//           {uniqueYears
//             .sort((a, b) => a - b)
//             .map((year, index) => (
//               <option key={index} value={year}>
//                 {year}
//               </option>
//             ))}
//         </select>
//       </div>
//       <div className="d-flex align-items-center gap-2">
//         <label className="my-auto">Month</label>
//         <select
//           className={`form-select rounded-2 ${
//             darkMode
//               ? "bg-light text-dark border dark-placeholder"
//               : "bg-dark text-light border-0 light-placeholder"
//           }`}
//           value={filterMonth}
//           onChange={(e) => setFilterMonth(parseInt(e.target.value))}
//         >
//           <option value="">--Select Month--</option>
//           {uniqueMonths
//             .sort((a, b) => a - b)
//             .map((month, index) => (
//               <option key={index} value={month}>
//                 {getUserStatusColor(month)}
//               </option>
//             ))}
//         </select>
//       </div>
//       <div className="d-flex">
//         <input
//           type="text"
//           className="form-control"
//           placeholder="Search by name"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>
//     </div>
//   </div>
// );

// AttendanceFilter.propTypes = {
//   filterYear: PropTypes.number.isRequired,
//   setFilterYear: PropTypes.func.isRequired,
//   filterMonth: PropTypes.number.isRequired,
//   setFilterMonth: PropTypes.func.isRequired,
//   uniqueYears: PropTypes.arrayOf(PropTypes.number).isRequired,
//   uniqueMonths: PropTypes.arrayOf(PropTypes.number).isRequired,
//   getUserStatusColor: PropTypes.func.isRequired,
//   searchQuery: PropTypes.string.isRequired,
//   setSearchQuery: PropTypes.func.isRequired,
//   darkMode: PropTypes.bool.isRequired,
//   isPayrollSend: PropTypes.bool.isRequired,
//   processAttendance: PropTypes.func.isRequired,
// };

// export default AttendanceFilter;