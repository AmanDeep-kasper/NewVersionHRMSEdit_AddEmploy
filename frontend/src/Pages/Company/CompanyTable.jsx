import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { RingLoader } from "react-spinners";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import BASE_URL from "../config/config";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import OverLayToolTip from "../../Utils/OverLayToolTip";
import { FiEdit2 } from "react-icons/fi";
import Pagination from "../../Utils/Pagination";
import { rowBodyStyle, rowHeadStyle } from "../../Style/TableStyle";
import { useSelector } from "react-redux";
import Styles from "../../Style/Scroller.module.css";
import CopyToClipboard from "../../Utils/CopyToClipboard/CopyToClipboard";
import api from "../config/api";
import { useBranding } from "../../Context/BrandingContext/BrandingContext";

const AdminCompanyTable = (props) => {
  const [companyData, setCompanyData] = useState([]);
  const { userData } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { darkMode } = useTheme();
  const userno = userData?.Account;

  const { lastUpdated } = useBranding();

  useEffect(() => {
    setLoading(true);
    api
      .get(`/api/company`)
      .then((response) => {
        setCompanyData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [lastUpdated]);

  const onCompanyDelete = (id) => {
    if (window.confirm("Are you sure to delete this record?")) {
      api
        .delete(`/api/company/${id}`,
        )
        .then(() =>
          setCompanyData(companyData.filter((item) => item._id !== id))
        )
        .catch((err) => console.log(err));
    }
  };

  const handlePaginationNext = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePaginationPrev = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = companyData.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(companyData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  // scrool start
  const scrollContainerRef = useRef(null); // Reference for the scrollable container
  const [isScrollable, setIsScrollable] = useState(false); // Track if content is scrollable

  // Detect if the table is scrollable horizontally
  const checkScrollable = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setIsScrollable(container.scrollWidth > container.clientWidth);
    }
  };

  // Handle horizontal scrolling on mouse move
  const handleMouseMove = (e) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const mouseX = e.clientX;

    // Detect if mouse is near the left or right edge
    const scrollSpeed = 10; // Speed of the scroll

    if (mouseX < containerRect.left + 50) {
      // Scroll left
      container.scrollLeft -= scrollSpeed;
    } else if (mouseX > containerRect.right - 50) {
      // Scroll right
      container.scrollLeft += scrollSpeed;
    }
  };

  useEffect(() => {
    checkScrollable(); // Check on mount and when data changes
    window.addEventListener("resize", checkScrollable); // Recheck on window resize
    return () => window.removeEventListener("resize", checkScrollable);
  }, [companyData]);

  // scrool end

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between py-2">
        <div className="my-auto">
          <h5
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
              fontWeight: "600",
            }}
            className=" m-0"
          >
            Company Details ({companyData.length})
          </h5>
          <p
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
            }}
            className=" m-0"
          >
            You can see all Company list here
          </p>
        </div>

        {userno === 1 && (
          <button
            className="btn btn-primary gap-1 d-flex my-auto align-items-center justify-content-center"
            onClick={props.onAddCompany}
          >
            <AiOutlinePlusCircle className="fs-4" />
            <span className="d-none d-md-flex">Create Company</span>
          </button>
        )}
      </div>

      {loading && (
        <div className="d-flex justify-content-center">
          <RingLoader size={50} color={"#0000ff"} loading={true} />
        </div>
      )}
      <div
        style={{
          color: darkMode
            ? "var(--secondaryDashColorDark)"
            : "var(--secondaryDashMenuColor)",
          overflow: "auto",
          maxHeight: "80vh",
          minHeight: "80vh",
          position: "relative",
        }}
      >
        {companyData.length > 0 ? (
          <>
            <div>
              <div
                ref={scrollContainerRef}
                style={{
                  height: "fit-content",
                  maxHeight: "70vh",
                  overflow: "auto",
                  position: "relative",
                  paddingBottom: "1rem",
                  cursor: isScrollable ? "ew-resize" : "default",
                  border: darkMode ? "var(--borderLight)" : "var(--borderDark)",
                }}
                className={`rounded-2 ${Styles.scroller}`}
                onMouseMove={handleMouseMove}
              >
                <table className="table mb-0 table-hover">
                  <thead>
                    <tr>
                      <th style={rowHeadStyle(darkMode)}>Logo</th>
                      <th style={rowHeadStyle(darkMode)}>Mini</th>
                      <th style={rowHeadStyle(darkMode)}>Company Name</th>
                      <th style={rowHeadStyle(darkMode)}>Address</th>
                      <th style={rowHeadStyle(darkMode)}>Country</th>
                      <th style={rowHeadStyle(darkMode)}>State</th>
                      <th style={rowHeadStyle(darkMode)}>City</th>
                      <th style={rowHeadStyle(darkMode)}>Postal Code</th>
                      <th style={rowHeadStyle(darkMode)}>Website</th>
                      <th style={rowHeadStyle(darkMode)}>Email</th>
                      <th style={rowHeadStyle(darkMode)}>Contact Person</th>
                      <th style={rowHeadStyle(darkMode)}>Contact No</th>
                      <th style={rowHeadStyle(darkMode)}>Fax No</th>
                      <th style={rowHeadStyle(darkMode)}>Pan No</th>
                      <th style={rowHeadStyle(darkMode)}>GST No</th>
                      <th style={rowHeadStyle(darkMode)}>CIN No</th>
                      {userno === 1 && (
                        <th className="text-end" style={rowHeadStyle(darkMode)}>
                          Action
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item) => (
                      <tr key={item._id}>
                        <td style={rowBodyStyle(darkMode)} className="py-3 pr-4">
                          <div style={{ width: 80, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img
                              src={item.logoUrl || '/logo.webp'}
                              alt={item.CompanyName || 'logo'}
                              style={{ maxHeight: 36, maxWidth: 76, objectFit: 'contain' }}
                            />
                          </div>
                        </td>

                        <td style={rowBodyStyle(darkMode)} className="py-3 pr-4">
                          <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img
                              src={item.miniIconUrl || '/MiniLogo.png'}
                              alt={item.CompanyName || 'mini'}
                              style={{ width: 30, height: 30, objectFit: 'contain' }}
                            />
                          </div>
                        </td>

                        <td
                          className="hover-copy-container py-3 pr-4"
                          style={rowBodyStyle(darkMode)}
                        >
                          <div className="d-flex align-items-center gap-2">
                            {item.CompanyName ? item.CompanyName : "N/A"}
                            <CopyToClipboard content={item.CompanyName} />
                          </div>
                        </td>
                        <td
                          className="text-capitalize hover-copy-container py-3 pr-4"
                          style={rowBodyStyle(darkMode)}
                        >
                          <div className="d-flex align-items-center gap-2">
                            {item.Address ? item.Address : "N/A"}
                            <CopyToClipboard content={item.Address} />
                          </div>
                        </td>
                        <td
                          className="text-capitalize hover-copy-container py-3 pr-4"
                          style={rowBodyStyle(darkMode)}
                        >
                          <div className="d-flex align-items-center gap-2">
                            {item.city[0].state[0].country[0].CountryName
                              ? item.city[0].state[0].country[0].CountryName
                              : "N/A"}
                            <CopyToClipboard
                              content={
                                item.city[0].state[0].country[0].CountryName
                              }
                            />
                          </div>
                        </td>
                        <td
                          className="text-capitalize hover-copy-container py-3 pr-4"
                          style={rowBodyStyle(darkMode)}
                        >
                          <div className="d-flex align-items-center gap-2">
                            {item.city[0].state[0].StateName
                              ? item.city[0].state[0].StateName
                              : "N/A"}
                            <CopyToClipboard
                              content={item.city[0].state[0].StateName}
                            />
                          </div>
                        </td>
                        <td
                          className="hover-copy-container py-3 pr-4"
                          style={rowBodyStyle(darkMode)}
                        >
                          <div className="d-flex align-items-center gap-2">
                            {item.city[0].CityName
                              ? item.city[0].CityName
                              : "N/A"}
                            <CopyToClipboard content={item.city[0].CityName} />
                          </div>
                        </td>
                        <td
                          className="hover-copy-container py-3 pr-4"
                          style={rowBodyStyle(darkMode)}
                        >
                          <div className="d-flex align-items-center gap-2">
                            {item.PostalCode ? item.PostalCode : "N/A"}
                            <CopyToClipboard content={item.PostalCode} />
                          </div>
                        </td>
                        <td
                          className="hover-copy-container py-3 pr-4"
                          style={rowBodyStyle(darkMode)}
                        >
                          <div className="d-flex align-items-center gap-2">
                            {item.Website ? item.Website : "N/A"}
                            <CopyToClipboard content={item.Website} />
                          </div>
                        </td>
                        <td
                          className="hover-copy-container py-3 pr-4"
                          style={rowBodyStyle(darkMode)}
                        >
                          <div className="d-flex align-items-center gap-2">
                            {item.Email ? item.Email : "N/A"}
                            <CopyToClipboard content={item.Email} />
                          </div>
                        </td>
                        <td
                          className="hover-copy-container py-3 pr-4"
                          style={rowBodyStyle(darkMode)}
                        >
                          <div className="d-flex align-items-center gap-2">
                            {item.ContactPerson}
                            <CopyToClipboard content={item.ContactPerson} />
                          </div>
                        </td>
                        <td
                          className="hover-copy-container py-3 pr-4"
                          style={rowBodyStyle(darkMode)}
                        >
                          <div className="d-flex align-items-center gap-2">
                            {item.ContactNo ? item.ContactNo : "N/A"}
                            <CopyToClipboard content={item.ContactNo} />
                          </div>
                        </td>
                        <td
                          className="hover-copy-container py-3 pr-4"
                          style={rowBodyStyle(darkMode)}
                        >
                          <div className="d-flex align-items-center gap-2">
                            {item.FaxNo ? item.FaxNo : "N/A"}
                            <CopyToClipboard content={item.FaxNo} />
                          </div>
                        </td>
                        <td
                          className="hover-copy-container py-3 pr-4"
                          style={rowBodyStyle(darkMode)}
                        >
                          <div className="d-flex align-items-center gap-2">
                            {item.PanNo ? item.PanNo : "N/A"}
                            <CopyToClipboard content={item.PanNo} />
                          </div>
                        </td>
                        <td
                          style={rowBodyStyle(darkMode)}
                          className="hover-copy-container py-3 pr-4"
                        >
                          <div className="d-flex align-items-center gap-2">
                            {item.GSTNo ? item.GSTNo : "N/A"}
                            <CopyToClipboard content={item.GSTNo} />
                          </div>
                        </td>
                        <td
                          className="hover-copy-container py-3 pr-4"
                          style={rowBodyStyle(darkMode)}
                        >
                          <div className="d-flex align-items-center gap-2">
                            {item.CINNo ? item.CINNo : "N/A"}
                            <CopyToClipboard content={item.CINNo} />
                          </div>
                        </td>
                        {userno === 1 && (
                          <td
                            className="text-end"
                            style={rowBodyStyle(darkMode)}
                          >
                            <OverLayToolTip
                              style={{ color: darkMode ? "black" : "white" }}
                              icon={<FiEdit2 className="text-primary" />}
                              onClick={() => props.onEditCompany(item)}
                              tooltip={"Edit Company"}
                            />
                            <OverLayToolTip
                              style={{ color: darkMode ? "black" : "white" }}
                              icon={
                                <AiOutlineDelete className="fs-5 text-danger" />
                              }
                              onClick={() => onCompanyDelete(item._id)}
                              tooltip={"Delete Company"}
                            />
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Pagination
              currentPage={currentPage}
              pageNumbers={pageNumbers}
              handlePaginationPrev={handlePaginationPrev}
              handlePaginationNext={handlePaginationNext}
              setCurrentPage={setCurrentPage}
              filteredDataLength={companyData.length}
              itemsPerPage={itemsPerPage}
            />
          </>
        ) : (
          !loading && (
            <div className="text-center py-5">No companies found.</div>
          )
        )}
      </div>
    </div>
  );
};

export default AdminCompanyTable;



// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { RingLoader } from "react-spinners";
// import { useTheme } from "../../Context/TheamContext/ThemeContext";
// import BASE_URL from "../config/config";
// import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
// import OverLayToolTip from "../../Utils/OverLayToolTip";
// import { FiEdit2 } from "react-icons/fi";
// import Pagination from "../../Utils/Pagination";
// import { rowBodyStyle, rowHeadStyle } from "../../Style/TableStyle";
// import { useSelector } from "react-redux";
// import Styles from "../../Style/Scroller.module.css";
// import CopyToClipboard from "../../Utils/CopyToClipboard/CopyToClipboard";
// import api from "../config/api";

// const AdminCompanyTable = (props) => {
//   const [companyData, setCompanyData] = useState([]);
//   const { userData } = useSelector((state) => state.user);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const { darkMode } = useTheme();
//   const userno = userData?.Account;

//   useEffect(() => {
//     api
//       .get(`/api/company`,
//     )
//       .then((response) => {
//         setCompanyData(response.data);
//         setLoading(false);
//       })
//       .catch((error) => console.log(error));
//   }, []);

//   const onCompanyDelete = (id) => {
//     if (window.confirm("Are you sure to delete this record?")) {
//       api
//         .delete(`/api/company/${id}`,
//         )
//         .then(() =>
//           setCompanyData(companyData.filter((item) => item._id !== id))
//         )
//         .catch((err) => console.log(err));
//     }
//   };

//   const handlePaginationNext = () => {
//     setCurrentPage((prevPage) => prevPage + 1);
//   };

//   const handlePaginationPrev = () => {
//     setCurrentPage((prevPage) => prevPage - 1);
//   };

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = companyData.slice(indexOfFirstItem, indexOfLastItem);

//   const pageNumbers = [];
//   for (let i = 1; i <= Math.ceil(companyData.length / itemsPerPage); i++) {
//     pageNumbers.push(i);
//   }

//   // scrool start
//   const scrollContainerRef = useRef(null); // Reference for the scrollable container
//   const [isScrollable, setIsScrollable] = useState(false); // Track if content is scrollable

//   // Detect if the table is scrollable horizontally
//   const checkScrollable = () => {
//     const container = scrollContainerRef.current;
//     if (container) {
//       setIsScrollable(container.scrollWidth > container.clientWidth);
//     }
//   };

//   // Handle horizontal scrolling on mouse move
//   const handleMouseMove = (e) => {
//     const container = scrollContainerRef.current;
//     if (!container) return;

//     const containerRect = container.getBoundingClientRect();
//     const mouseX = e.clientX;

//     // Detect if mouse is near the left or right edge
//     const scrollSpeed = 10; // Speed of the scroll

//     if (mouseX < containerRect.left + 50) {
//       // Scroll left
//       container.scrollLeft -= scrollSpeed;
//     } else if (mouseX > containerRect.right - 50) {
//       // Scroll right
//       container.scrollLeft += scrollSpeed;
//     }
//   };

//   useEffect(() => {
//     checkScrollable(); // Check on mount and when data changes
//     window.addEventListener("resize", checkScrollable); // Recheck on window resize
//     return () => window.removeEventListener("resize", checkScrollable);
//   }, [companyData]);

//   // scrool end

//   return (
//     <div className="container-fluid py-2">
//       <div className="d-flex justify-content-between py-2">
//         <div className="my-auto">
//           <h5
//             style={{
//               color: darkMode
//                 ? "var(--secondaryDashColorDark)"
//                 : "var(--secondaryDashMenuColor)",
//               fontWeight: "600",
//             }}
//             className=" m-0"
//           >
//             Company Details ({companyData.length})
//           </h5>
//           <p
//             style={{
//               color: darkMode
//                 ? "var(--secondaryDashColorDark)"
//                 : "var(--secondaryDashMenuColor)",
//             }}
//             className=" m-0"
//           >
//             You can see all Company list here
//           </p>
//         </div>

//         {userno === 1 && (
//           <button
//             className="btn btn-primary gap-1 d-flex my-auto align-items-center justify-content-center"
//             onClick={props.onAddCompany}
//           >
//             <AiOutlinePlusCircle className="fs-4" />
//             <span className="d-none d-md-flex">Create Company</span>
//           </button>
//         )}
//       </div>

//       {loading && (
//         <div className="d-flex justify-content-center">
//           <RingLoader size={50} color={"#0000ff"} loading={true} />
//         </div>
//       )}
//       <div
//         style={{
//           color: darkMode
//             ? "var(--secondaryDashColorDark)"
//             : "var(--secondaryDashMenuColor)",
//           overflow: "auto",
//           maxHeight: "80vh",
//           minHeight: "80vh",
//           position: "relative",
//         }}
//       >
//         {companyData.length > 0 ? (
//           <>
//             <div>
//               <div
//                 ref={scrollContainerRef}
//                 style={{
//                   height: "fit-content",
//                   maxHeight: "70vh",
//                   overflow: "auto",
//                   position: "relative",
//                   paddingBottom: "1rem",
//                   cursor: isScrollable ? "ew-resize" : "default",
//                   border: darkMode ? "var(--borderLight)" : "var(--borderDark)",
//                 }}
//                 className={`rounded-2 ${Styles.scroller}`}
//                 onMouseMove={handleMouseMove}
//               >
//                 <table className="table mb-0 table-hover">
//                   <thead>
//                     <tr>
//                       <th style={rowHeadStyle(darkMode)}>Company Name</th>
//                       <th style={rowHeadStyle(darkMode)}>Address</th>
//                       <th style={rowHeadStyle(darkMode)}>Country</th>
//                       <th style={rowHeadStyle(darkMode)}>State</th>
//                       <th style={rowHeadStyle(darkMode)}>City</th>
//                       <th style={rowHeadStyle(darkMode)}>Postal Code</th>
//                       <th style={rowHeadStyle(darkMode)}>Website</th>
//                       <th style={rowHeadStyle(darkMode)}>Email</th>
//                       <th style={rowHeadStyle(darkMode)}>Contact Person</th>
//                       <th style={rowHeadStyle(darkMode)}>Contact No</th>
//                       <th style={rowHeadStyle(darkMode)}>Fax No</th>
//                       <th style={rowHeadStyle(darkMode)}>Pan No</th>
//                       <th style={rowHeadStyle(darkMode)}>GST No</th>
//                       <th style={rowHeadStyle(darkMode)}>CIN No</th>
//                       {userno === 1 && (
//                         <th className="text-end" style={rowHeadStyle(darkMode)}>
//                           Action
//                         </th>
//                       )}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {currentItems.map((item) => (
//                       <tr key={item._id}>
//                         <td
//                           className="hover-copy-container py-3 pr-4"
//                           style={rowBodyStyle(darkMode)}
//                         >
//                           <div className="d-flex align-items-center gap-2">
//                             {item.CompanyName ? item.CompanyName : "N/A"}
//                             <CopyToClipboard content={item.CompanyName} />
//                           </div>
//                         </td>
//                         <td
//                           className="text-capitalize hover-copy-container py-3 pr-4"
//                           style={rowBodyStyle(darkMode)}
//                         >
//                           <div className="d-flex align-items-center gap-2">
//                             {item.Address ? item.Address : "N/A"}
//                             <CopyToClipboard content={item.Address} />
//                           </div>
//                         </td>
//                         <td
//                           className="text-capitalize hover-copy-container py-3 pr-4"
//                           style={rowBodyStyle(darkMode)}
//                         >
//                           <div className="d-flex align-items-center gap-2">
//                             {item.city[0].state[0].country[0].CountryName
//                               ? item.city[0].state[0].country[0].CountryName
//                               : "N/A"}
//                             <CopyToClipboard
//                               content={
//                                 item.city[0].state[0].country[0].CountryName
//                               }
//                             />
//                           </div>
//                         </td>
//                         <td
//                           className="text-capitalize hover-copy-container py-3 pr-4"
//                           style={rowBodyStyle(darkMode)}
//                         >
//                           <div className="d-flex align-items-center gap-2">
//                             {item.city[0].state[0].StateName
//                               ? item.city[0].state[0].StateName
//                               : "N/A"}
//                             <CopyToClipboard
//                               content={item.city[0].state[0].StateName}
//                             />
//                           </div>
//                         </td>
//                         <td
//                           className="hover-copy-container py-3 pr-4"
//                           style={rowBodyStyle(darkMode)}
//                         >
//                           <div className="d-flex align-items-center gap-2">
//                             {item.city[0].CityName
//                               ? item.city[0].CityName
//                               : "N/A"}
//                             <CopyToClipboard content={item.city[0].CityName} />
//                           </div>
//                         </td>
//                         <td
//                           className="hover-copy-container py-3 pr-4"
//                           style={rowBodyStyle(darkMode)}
//                         >
//                           <div className="d-flex align-items-center gap-2">
//                             {item.PostalCode ? item.PostalCode : "N/A"}
//                             <CopyToClipboard content={item.PostalCode} />
//                           </div>
//                         </td>
//                         <td
//                           className="hover-copy-container py-3 pr-4"
//                           style={rowBodyStyle(darkMode)}
//                         >
//                           <div className="d-flex align-items-center gap-2">
//                             {item.Website ? item.Website : "N/A"}
//                             <CopyToClipboard content={item.Website} />
//                           </div>
//                         </td>
//                         <td
//                           className="hover-copy-container py-3 pr-4"
//                           style={rowBodyStyle(darkMode)}
//                         >
//                           <div className="d-flex align-items-center gap-2">
//                             {item.Email ? item.Email : "N/A"}
//                             <CopyToClipboard content={item.Email} />
//                           </div>
//                         </td>
//                         <td
//                           className="hover-copy-container py-3 pr-4"
//                           style={rowBodyStyle(darkMode)}
//                         >
//                           <div className="d-flex align-items-center gap-2">
//                             {item.ContactPerson}
//                             <CopyToClipboard content={item.ContactPerson} />
//                           </div>
//                         </td>
//                         <td
//                           className="hover-copy-container py-3 pr-4"
//                           style={rowBodyStyle(darkMode)}
//                         >
//                           <div className="d-flex align-items-center gap-2">
//                             {item.ContactNo ? item.ContactNo : "N/A"}
//                             <CopyToClipboard content={item.ContactNo} />
//                           </div>
//                         </td>
//                         <td
//                           className="hover-copy-container py-3 pr-4"
//                           style={rowBodyStyle(darkMode)}
//                         >
//                           <div className="d-flex align-items-center gap-2">
//                             {item.FaxNo ? item.FaxNo : "N/A"}
//                             <CopyToClipboard content={item.FaxNo} />
//                           </div>
//                         </td>
//                         <td
//                           className="hover-copy-container py-3 pr-4"
//                           style={rowBodyStyle(darkMode)}
//                         >
//                           <div className="d-flex align-items-center gap-2">
//                             {item.PanNo ? item.PanNo : "N/A"}
//                             <CopyToClipboard content={item.PanNo} />
//                           </div>
//                         </td>
//                         <td
//                           style={rowBodyStyle(darkMode)}
//                           className="hover-copy-container py-3 pr-4"
//                         >
//                           <div className="d-flex align-items-center gap-2">
//                             {item.GSTNo ? item.GSTNo : "N/A"}
//                             <CopyToClipboard content={item.GSTNo} />
//                           </div>
//                         </td>
//                         <td
//                           className="hover-copy-container py-3 pr-4"
//                           style={rowBodyStyle(darkMode)}
//                         >
//                           <div className="d-flex align-items-center gap-2">
//                             {item.CINNo ? item.CINNo : "N/A"}
//                             <CopyToClipboard content={item.CINNo} />
//                           </div>
//                         </td>
//                         {userno === 1 && (
//                           <td
//                             className="text-end"
//                             style={rowBodyStyle(darkMode)}
//                           >
//                             <OverLayToolTip
//                               style={{ color: darkMode ? "black" : "white" }}
//                               icon={<FiEdit2 className="text-primary" />}
//                               onClick={() => props.onEditCompany(item)}
//                               tooltip={"Edit Company"}
//                             />
//                             <OverLayToolTip
//                               style={{ color: darkMode ? "black" : "white" }}
//                               icon={
//                                 <AiOutlineDelete className="fs-5 text-danger" />
//                               }
//                               onClick={() => onCompanyDelete(item._id)}
//                               tooltip={"Delete Company"}
//                             />
//                           </td>
//                         )}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             <Pagination
//               currentPage={currentPage}
//               pageNumbers={pageNumbers}
//               handlePaginationPrev={handlePaginationPrev}
//               handlePaginationNext={handlePaginationNext}
//               setCurrentPage={setCurrentPage}
//               filteredDataLength={companyData.length}
//               itemsPerPage={itemsPerPage}
//             />
//           </>
//         ) : (
//           !loading && (
//             <div className="text-center py-5">No companies found.</div>
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminCompanyTable;
