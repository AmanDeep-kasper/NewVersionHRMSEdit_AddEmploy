import React, { useState, useRef, useEffect } from "react";
import { Form, ListGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { SearchRouteData } from "./SearchRouteData";
import BASE_URL from "../../Pages/config/config";
import axios from "axios";
import { useTheme } from "../../Context/TheamContext/ThemeContext";
import { useSelector } from "react-redux";
import api from "../../Pages/config/api";

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { userData } = useSelector((state) => state.user);
  const [expanded, setExpanded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null); 

  const { id, Account} = userData || {};
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setSelectedIndex(-1);
    setExpanded(true);
  };

  const handleLinkClick = () => {
    setSearchTerm("");
    setExpanded(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      setSelectedIndex((prevIndex) =>
        Math.min(prevIndex + 1, filteredRoutes.length - 1)
      );
    } else if (event.key === "ArrowUp") {
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    } else if (event.key === "Enter" && selectedIndex >= 0) {
      event.preventDefault();
      navigate(filteredRoutes[selectedIndex].path);
      setSearchTerm("");
      setExpanded(false);
    } else if (event.key === "Escape") {
      setSearchTerm("");
      setExpanded(false);
    }
  };

  const filteredRoutes = searchTerm
    ? SearchRouteData.filter((route) => {
        const isNameMatch = route.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const isUserTypeMatch = (() => {
          switch (Account) {
            case 1:
              return route.control === "admin";
            case 2:
              return route.control === "hr";
            case 3:
              return route.control === "employee";
            case 4:
              return route.control === "manager";
            default:
              return false;
          }
        })();
        return isNameMatch && isUserTypeMatch;
      }).slice(0, 5)
    : [];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setSearchTerm("");
        setExpanded(false);
      }
    };

    document.body.addEventListener("click", handleClickOutside);

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Handle Alt + S key activation
  useEffect(() => {
    const handleAltSKey = (event) => {
      if (event.altKey && (event.key === "s" || event.key === "S")) {
        event.preventDefault();
        inputRef.current?.focus();
        setExpanded(true);
      }
      if (event.altKey && (event.key === "s" || event.key === "S")) {
        event.preventDefault();
        inputRef.current?.focus();
        setExpanded(true);
      }
    };

    document.addEventListener("keydown", handleAltSKey);
    return () => {
      document.removeEventListener("keydown", handleAltSKey);
    };
  }, []);

  return (
    <div
      className="mx-2"
      style={{
        width: "auto",
        height: "2.2rem",
        position: "relative",
      }}
    >
      <Form.Control
        ref={inputRef} // Attach ref to the input field
        data-theme={darkMode ? "black" : "white"}
        className={`form-control ms-0 ms-md-auto rounded-3 ${
          darkMode
            ? "bg-light text-dark border dark-placeholder"
            : "bg-dark text-light border-0 light-placeholder"
        }`}
        placeholder="Search "
        style={{
          height: "2.3rem",
          paddingLeft: ".8rem",
          borderRadius: filteredRoutes.length > 0 ? "8px 8px 0 0" : "8px",
          background: darkMode ? "white" : "black",
          color: !darkMode ? "white" : "black",
        }}
        value={searchTerm}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
      />
      {window.innerWidth >= 576 && (
        <>
          {" "}
          {!expanded && (
            <span
              className="rounded-2 fw-bold d-flex "
              style={{
                position: "absolute",
                top: "50%",
                right: ".3rem",
                transform: "translateY(-50%)",
                fontSize: ".7rem",
                padding: ".2rem  .2rem .1rem .2rem ",
                color: !darkMode ? "#adadc9" : "#adadc9",
                background: darkMode ? "#232023" : "#322d31",
              }}
            >
              Alt + S
            </span>
          )}
        </>
      )}

      {filteredRoutes.length > 0 ? (
        <ListGroup
          className="py-2 px-1"
          style={{
            position: "absolute",
            width: "100%",
            minWidth: "fit-content",
            whiteSpace: "pre",
            borderRadius: "0 0 8px 8px",
            zIndex: "2000",
            background: darkMode ? "white" : "black",
          }}
        >
          {filteredRoutes.map((route, index) => (
            <Link
              style={{ textDecorationLine: "none", width: "100%" }}
              to={route.path}
              key={index}
              onClick={handleLinkClick}
            >
              <div
                style={{
                  textDecorationLine: "none",
                  backgroundColor:
                    index === selectedIndex ? "#abcdf56f" : "transparent",
                  boxShadow:
                    index === selectedIndex
                      ? "0 2px 3px 2px rgba(0,0,0,.2)"
                      : "none",

                  padding: "5px",
                  color: !darkMode ? "white" : "black",
                }}
                className="search-hoverable-text"
              >
                {route.name}
              </div>
            </Link>
          ))}
        </ListGroup>
      ) : (
        <div>
          {searchTerm && expanded && (
            <span
              style={{
                position: "absolute",
                bottom: "-100%",

                width: "100%",
                minWidth: "fit-content",
                whiteSpace: "pre",
                textAlign: "start",
              }}
              className={`p-1 text-center border ${
                darkMode
                  ? "bg-light text-dark border-white rounded-2"
                  : "bg-dark text-light border-dark rounded-2"
              }`}
            >
              No result found
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
