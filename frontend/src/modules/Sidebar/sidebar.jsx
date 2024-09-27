import React, { useState } from "react";
import "../../assets/global/style.css";
import "./styles/sidebar.css";
import logo from "../../../src/logo.png";
import { Link } from "react-router-dom";

const Sidebar = ({ onModuleChange }) => {
  /* ---------------------------- Administrator MOdule ---------------------*/
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);
  const [showUserMasterDataDropdown, setShowUserMasterDataDropdown] =
    useState(false);
  const [showBPMasterDataDropdown, setShowBPMasterDataDropdown] =
    useState(false);
  const [showCommodityMasterDataDropdown, setShowCommodityMasterDataDropdown] =
    useState(false);

  const toggleAdminDropdown = () => {
    setShowAdminDropdown(!showAdminDropdown);
  };

  const toggleUserMasterDataDropdown = () => {
    setShowUserMasterDataDropdown(!showUserMasterDataDropdown);
  };

  return (
    <div className="sidebar sidebar-offcanvas" id="sidebar">
      <div className="header">
        <img src={logo} alt="Logo" style={{ width: "150px" }} />
        {/* <div className="welcome">
          <p>Welcome back!</p>
        </div> */}
      </div>
      <ul className="menu">
        <Link className="nav-link" to={"/dashboard"}>
          <li className="module">
            <i className=""></i>
            Dashboard
          </li>
        </Link>
        <li className="module" onClick={toggleAdminDropdown}>
          Administrator
        </li>
        <ul className={`dropdown ${showAdminDropdown ? "expanded" : ""}`}>
          <li className="submodule" onClick={toggleUserMasterDataDropdown}>
            User Master Data
          </li>
          <ul
            className={`sub-dropdown ${
              showUserMasterDataDropdown ? "expanded" : ""
            }`}
          >
            <Link className="nav-link" to={"/admin/masterList"}>
              <li className="nest-submodule">MasterList</li>
            </Link>

            <Link className="nav-link" to={"/userRole"}>
              <li className="nest-submodule">User Role</li>
            </Link>
          </ul>
        </ul>{" "}
        <Link to={"/Department"} className="nav-link">
          <li className="module">Department</li>
        </Link>
      </ul>{" "}
    </div>
  );
};

export default Sidebar;
