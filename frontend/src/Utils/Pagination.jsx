import React from "react";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { useTheme } from "../Context/TheamContext/ThemeContext";

const Pagination = ({
  currentPage,
  totalPages,
  handlePaginationPrev,
  handlePaginationNext,
  setCurrentPage,
  filteredDataLength,
  itemsPerPage,
}) => {
  const { darkMode } = useTheme();

  // Calculate indices for displayed items
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = Math.min(currentPage * itemsPerPage, filteredDataLength);
  const calculatedTotalPages = Math.ceil(filteredDataLength / itemsPerPage);

  // Generate page numbers with ellipsis logic
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 10; // Maximum number of page buttons to show (excluding ellipsis)

    if (calculatedTotalPages <= maxPagesToShow) {
      // If total pages are 5 or less, show all pages
      for (let i = 1; i <= calculatedTotalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show the first page
      pageNumbers.push(1);

      // If currentPage is greater than 3, add ellipsis after 1
      if (currentPage > 3) {
        pageNumbers.push("...");
      }

      // Calculate the range of pages to show around the current page
      let startPage = Math.max(2, currentPage - 1); // Start at least from page 2
      let endPage = Math.min(calculatedTotalPages - 1, currentPage + 1); // End before the last page

      // Adjust startPage and endPage to ensure we show 3 pages around the current page when possible
      if (currentPage <= 3) {
        startPage = 2;
        endPage = 4;
      } else if (currentPage >= calculatedTotalPages - 2) {
        startPage = calculatedTotalPages - 3;
        endPage = calculatedTotalPages - 1;
      }

      // Add the range of pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // If currentPage is less than totalPages - 2, add ellipsis before the last page
      if (currentPage < calculatedTotalPages - 2) {
        pageNumbers.push("...");
      }

      // Always show the last page
      pageNumbers.push(calculatedTotalPages);
    }

    return pageNumbers;
  };

  return (
    <div
      className="container-fluid d-flex  gap-3 py-2 px-2 rounded-2 flex-md-row w-100 justify-content-between align-items-center my-2"
      style={{
        background: darkMode ? "var(--primaryDashMenuColor)" : "var(--primaryDashColorDark)",
      }}
    >
      <div
        className="d-flex flex-column-reverse flex-md-row p-2 row-gap-3 flex-wrap justify-content-between align-items-center w-100"
        style={{
          background: darkMode ? "var(--secondaryDashMenuColor)" : "var(--secondaryDashColorDark)",
        }}
      >
        <div className="my-auto text-nowrap" style={{ color: !darkMode ? "white" : "black" }}>
          Showing {indexOfFirstItem + 1} to {indexOfLastItem} of {filteredDataLength} results
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* Previous Button */}
          <button
            className={` btn btn-white border border-1 border-white d-flex align-items-center gap-1  ${!darkMode ? "text-light " : "text-dark "}`}
            onClick={handlePaginationPrev}
            disabled={currentPage === 1}
            aria-label="Previous Page"
          >
            <GrFormPrevious className="my-auto" />
            <span className="d-none d-md-flex">Previous</span>
          </button>

          {/* Pagination Numbers */}
          <div className="pagination d-flex flex-nowrap gap-2">
            {getPageNumbers().map((number, index) =>
              number === "..." ? (
                <span key={`my-auto ellipsis-${index}`} className={!darkMode ? "text-light fs-5" : "text-dark fs-5"}>
                  ...
                </span>
              ) : (
                <button
                  key={number}
                  className={`rounded-2 border ${
                    currentPage === number ? "bg-primary text-white" : "bg-light text-dark"
                  }`}
                  style={{
                    height: "2.5rem",
                    width: "2.5rem",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={() => setCurrentPage(number)}
                >
                  {number}
                </button>
              )
            )}
          </div>

          {/* Next Button */}
          <button className={` btn btn-white border border-1 border-white d-flex align-items-center gap-1  ${!darkMode ? "text-light " : "text-dark "}`}
            onClick={handlePaginationNext}
            disabled={currentPage >= calculatedTotalPages}
            aria-label="Next Page"
          >
            <span className="d-none d-md-flex">Next</span>
            <GrFormNext className="my-auto" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;