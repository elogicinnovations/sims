import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ELI from "../../../src/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const handleLogout = () => {
    console.log("User logged out");
    navigate("/"); // Redirect to the root path
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleClickOutside = (event) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setShowNotifications(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="custom-navbar navbar-expand-lg navbar-light bg-white border-bottom">
      <div className="container-fluid d-flex justify-content-between align-items-center h-100">
        <div className="navbar-brand">
          {/* You can add your brand/logo here */}
          {/* <img src={ELI} alt="Your Logo" height="30" /> */}
        </div>
        <div className="d-flex align-items-center h-100">
          <div className="p-2 position-relative">
            <div className="bg-danger rounded-circle have-notif position-absolute"></div>
            <i
              className="fa-regular fa-bell fs-4 notification mx-3"
              onClick={toggleNotifications}
              style={{ cursor: "pointer" }}
            ></i>

            {showNotifications && (
              <div
                ref={notificationRef}
                className="position-absolute notification-card bg-white shadow-sm rounded p-3 border"
              >
                <h6>Notifications</h6>
                <ul className="list-unstyled notification-list">
                  <li className="mb-2">
                    <div className="d-flex">
                      <div className="me-3">
                        <i className="fa fa-envelope"></i>
                      </div>
                      <div>
                        <p className="mb-1">New message received</p>
                        <small className="text-muted">2 mins ago</small>
                      </div>
                    </div>
                  </li>
                  <li className="mb-2">
                    <div className="d-flex">
                      <div className="me-3">
                        <i className="fa fa-check"></i>
                      </div>
                      <div>
                        <p className="mb-1">Task completed</p>
                        <small className="text-muted">10 mins ago</small>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="d-flex">
                      <div className="me-3">
                        <i className="fa fa-user"></i>
                      </div>
                      <div>
                        <p className="mb-1">New user registered</p>
                        <small className="text-muted">30 mins ago</small>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="dropdown d-flex align-items-center h-100 user-infos">
            <div
              className="d-flex align-items-center"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div className="user-info me-2 m-2 ">
                <div className="user-name">Regin Leagaspi</div>
                <div className="text-secondary user-role">Administrator</div>
              </div>
              <img
                src={ELI}
                alt="Profile"
                className="rounded-circle border user-image m-2 h-100"
              />
              <i className="fa-solid fa-sort-down ms-2 m-2"></i>
            </div>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button className="dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
