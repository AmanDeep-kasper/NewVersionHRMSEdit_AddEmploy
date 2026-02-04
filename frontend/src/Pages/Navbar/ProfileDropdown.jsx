import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faUserCircle } from "@fortawesome/free-solid-svg-icons";

function ProfileDropdown({
  userData,
  employeeData,
  profile,
  id,
  location,
  handleLogout,
  UserType,
  ShortedText,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (e) => {
    e.stopPropagation(); // Prevent immediate close from document click
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const fullName =
    `${userData?.FirstName || ""} ${userData?.LastName || ""}`.trim();
  const avatarSrc =
    employeeData?.profile?.image_url || profile || "";

  return (
    <div className="position-relative" ref={wrapperRef}>
      {/* Avatar - click to toggle */}
      <button
        type="button"
        className="btn p-0 border-0 avatar-trigger"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        <div
          className={`avatar rounded-circle overflow-hidden shadow-sm border ${isOpen ? "border-primary ring" : "border-secondary-subtle"}`}
          style={{ height: "30px", width: "30px",}}
        >
          <img
            src={avatarSrc}
            alt="Profile"
            className="w-100 h-100 object-fit-cover"
            onError={(e) => {
              e.target.src = "";
            }}
          />
        </div>
      </button>

      {/* Dropdown */}
      <div
        className={`profile-dropdown shadow-lg rounded-3 bg-white border ${isOpen ? "show" : ""}`}
      >
        <div className="p-3 border-bottom">
          <div className="d-flex align-items-center gap-3">
            <div className="avatar-lg rounded-circle overflow-hidden border border-light">
              <img
                src={avatarSrc}
                alt="Profile"
                className="w-100 h-100 object-fit-cover"
              />
            </div>
            <div className="overflow-hidden">
              <h6 className="mb-1 fw-semibold text-truncate">
                {fullName || "User"}
              </h6>
              <div className="small text-muted">
                {UserType?.(userData?.Account) || "Account"}
              </div>
              <div
                className="small text-muted text-truncate mt-1"
                title={userData?.Email}
              >
                {ShortedText?.(userData?.Email) || userData?.Email || "—"}
              </div>
            </div>
          </div>
        </div>

        <div className="py-1">
          {location !== "admin" && (
            <Link
              to={
                location === "employee"
                  ? `/employee/${id}/personal-info`
                  : `/${location}/personal-info`
              }
              className="dropdown-item px-4 py-2 d-flex align-items-center gap-3"
              onClick={closeDropdown}
            >
              <FontAwesomeIcon
                icon={faUserCircle}
                className="text-muted"
                width={18}
              />
              <span>My Profile</span>
            </Link>
          )}

          <button
            className="dropdown-item px-4 py-2 text-danger d-flex align-items-center gap-3"
            onClick={() => {
              closeDropdown();
              handleLogout();
            }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} width={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .avatar-trigger {
          width: 42px;
          height: 42px;
          transition: all 0.2s;
        }

        .avatar-trigger:hover {
          opacity: 0.9;
          transform: scale(1.05);
        }

        .avatar {
          width: 42px;
          height: 42px;
          background: #f1f3f5;
          transition: all 0.2s;
        }

        .avatar.ring {
          box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25);
        }

        .avatar-lg {
          width: 56px;
          height: 56px;
          background: #f1f3f5;
        }

        .profile-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          min-width: 260px;
          margin-top: 12px;
          z-index: 1000;
          opacity: 0;
          transform: translateY(-8px);
          pointer-events: none;
          transition: all 0.18s ease;
        }

        .profile-dropdown.show {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .dropdown-item {
          transition: background-color 0.15s;
          color: #212529;
        }

        .dropdown-item:hover {
          background-color: #f8f9fa;
        }

        .dropdown-item.text-danger:hover {
          background-color: #fff5f5;
        }
      `}</style>
    </div>
  );
}

export default ProfileDropdown;
