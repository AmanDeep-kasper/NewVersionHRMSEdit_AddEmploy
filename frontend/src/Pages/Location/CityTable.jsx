import React, { useState, useEffect } from "react";
import "./CityTable.css";
import axios from "axios";
import { RingLoader } from "react-spinners";
import { css } from "@emotion/core";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { AiOutlineDelete, AiOutlinePlusCircle } from "react-icons/ai";
import BASE_URL from "../config/config";
import OverLayToolTip from "../../Utils/OverLayToolTip";
import { FiEdit2 } from "react-icons/fi";
import Pagination from "../../Utils/Pagination";
import { rowBodyStyle, rowHeadStyle } from "../../Style/TableStyle";
import api from "../../Pages/config/api";

const override = css`
  display: block;
  margin: 0 auto;
  margin-top: 45px;
  border-color: red;
`;

const CityTable = ({ onAddCity, onEditCity }) => {
  const [cityData, setCityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { darkMode } = useTheme();

  useEffect(() => {
    loadCityData();
  }, [currentPage]);

  const loadCityData = () => {
    setLoading(true);
    api
      .get(`/api/city`, {
       
      })
      .then((response) => {
        const cityObj = response.data;
        setCityData(cityObj);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const onCityDelete = (id) => {
    if (window.confirm("Are you sure to delete this record?")) {
      api
        .delete(`/api/city/${id}`, {
         
        })
        .then(() => {
          loadCityData();
        })
        .catch((err) => {
          console.log(err);
          if (err.response && err.response.status === 403) {
            window.alert(err.response.data);
          } else {
            window.alert("An error occurred while deleting the record.");
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
  const currentItems = cityData.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(cityData.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div
      style={{ height: "83vh", overflow: "hidden" }}
      className="container-fluid py-2"
    >
      <div className="d-flex justify-content-between align-items-start mb-3">
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
            City Details ({cityData.length})
          </h5>
          <p
            style={{
              color: darkMode
                ? "var(--secondaryDashColorDark)"
                : "var(--secondaryDashMenuColor)",
            }}
            className="m-0"
          >
            You can see all city's list here.
          </p>
        </div>
        <button
          className="btn btn-primary gap-1 d-flex my-auto align-items-center justify-content-center"
          onClick={onAddCity}
        >
          <AiOutlinePlusCircle className="fs-4" />
          <span className="d-none d-md-flex">Add City</span>
        </button>
      </div>
      <div id="clear-both" />

      {!loading ? (
        <div className="d-flex flex-column">
          <div className="flex-grow-1">
            <div
              style={{
                height: "75vh",
                overflow: "auto",
                position: "relative",
              }}
              className="table-responsive shadow-sm rounded-3 border mt-2 mb-3 p-0"
            >
              <table className="table">
                <thead>
                  <tr style={{ position: "sticky", top: "0" }}>
                    <th style={rowHeadStyle(darkMode)}>Country</th>
                    <th style={rowHeadStyle(darkMode)}>State</th>
                    <th style={rowHeadStyle(darkMode)}>City</th>
                    <th style={rowHeadStyle(darkMode)} className="text-end">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((items, index) => (
                    <tr className="text-capitalize" key={index}>
                      <td style={rowBodyStyle(darkMode)}>
                        {items.state[0].country[0].CountryName}
                      </td>
                      <td style={rowBodyStyle(darkMode)}>
                        {items.state[0].StateName}
                      </td>
                      <td style={rowBodyStyle(darkMode)}>{items.CityName}</td>
                      <td className="text-end" style={rowBodyStyle(darkMode)}>
                        <OverLayToolTip
                          style={{ color: darkMode ? "black" : "white" }}
                          icon={<FiEdit2 className="text-primary" />}
                          onClick={() => onEditCity(items)}
                          tooltip={"Edit City"}
                        />
                        <OverLayToolTip
                          style={{ color: darkMode ? "black" : "white" }}
                          icon={
                            <AiOutlineDelete className="fs-5 text-danger" />
                          }
                          onClick={() => onCityDelete(items._id)}
                          tooltip={"Delete City"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              pageNumbers={pageNumbers}
              handlePaginationPrev={handlePaginationPrev}
              handlePaginationNext={handlePaginationNext}
              setCurrentPage={setCurrentPage}
              filteredDataLength={cityData.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        </div>
      ) : (
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
    </div>
  );
};

export default CityTable;
