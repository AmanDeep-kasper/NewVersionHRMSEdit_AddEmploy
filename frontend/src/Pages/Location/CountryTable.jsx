import React, { useState, useEffect, useCallback } from "react";
import "./CountryTable.css";
import axios from "axios";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import BASE_URL from "../config/config";
import OverLayToolTip from "../../Utils/OverLayToolTip";
import { FiEdit2 } from "react-icons/fi";
import { rowBodyStyle, rowHeadStyle } from "../../Style/TableStyle";
import Pagination from "../../Utils/Pagination";
import api from "../config/api";

const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const CountryTable = (props) => {
  const [countryData, setCountryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const { darkMode } = useTheme();

  const loadCountryData = useCallback(() => {
    api
      .get(`/api/country`, {
       
      })
      .then((response) => {
        setCountryData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    loadCountryData();
  }, [loadCountryData]);

  const onCountryDelete = (id) => {
    if (window.confirm("Are you sure to delete this record?")) {
      api
        .delete(`/api/country/${id}`, {
        })
        .then(() => {
          loadCountryData();
        })
        .catch((err) => {
          if (err.response.status === 403) {
            window.alert(err.response.data);
          }
        });
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
  const currentItems = countryData.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(countryData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

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
            className="m-0"
          >
            Country Details ({countryData.length})
          </h5>
          <p
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
            }}
            className="m-0"
          >
            You can see all country list here.
          </p>
        </div>
        <button
          className="btn btn-primary gap-1 d-flex my-auto align-items-center justify-content-center"
          onClick={props.onAddCountry}
        >
          <AiOutlinePlusCircle className="fs-4" />
          <span className="d-none d-md-flex">Add Country</span>
        </button>
      </div>

      <div id="clear-both" />
      {loading && (
        <div id="loading-bar">
          <RingLoader
            css={override}
            sizeUnit={"px"}
            size={50}
            color={"#0000ff"}
            loading={true}
          />
        </div>
      )}
      <div>
        <div
          className={`table-responsive container-fluid ${
            darkMode ? " tableParent-light" : " tableParent-dark"
          }`}
        >
          <div
            style={{
              height: "fit-content",
              maxHeight: "70vh",
              overflow: "auto",
              position: "relative",
            }}
            className="scroller"
          >
            <table className="table mb-0 table-hover">
              <thead>
                <tr style={{ position: "sticky", top: "0" }}>
                  <th style={rowHeadStyle(darkMode)}>Country</th>
                  <th className="text-end" style={rowHeadStyle(darkMode)}>
                    Action
                  </th>
                </tr>
              </thead>
              <hr className="m-0 py-1" style={{ opacity: "0" }} />
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index}>
                    <td style={rowBodyStyle(darkMode)}>{item.CountryName}</td>
                    <td className="text-end" style={rowBodyStyle(darkMode)}>
                      <OverLayToolTip
                        style={{ color: darkMode ? "black" : "white" }}
                        icon={<FiEdit2 className="text-primary" />}
                        onClick={() => props.onEditCountry(item)}
                        tooltip={"Edit Country"}
                      />
                      <OverLayToolTip
                        style={{ color: darkMode ? "black" : "white" }}
                        icon={<AiOutlineDelete className="fs-5 text-danger" />}
                        onClick={() => onCountryDelete(item._id)}
                        tooltip={"Delete Country"}
                      />
                    </td>
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
          filteredDataLength={countryData.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
};

export default CountryTable;
