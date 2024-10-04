import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import BASE_URL from "../../assets/global/url";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import CreateStaff from "./createModal";
import UpdateModal from "./updateModal";

function Staff() {
  const [filteredData, setFilteredData] = useState([]);
  const [inboundData, setInboundData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // Status filter state

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const [showCreateStaffModal, setShowCreateStaffModal] = useState(false);
  const handleShowCreateStaffModal = () => setShowCreateStaffModal(true);
  const handleCloseCreateStaffModal = () => setShowCreateStaffModal(false);

  const reloadTable = () => {
    axios
      .get(BASE_URL + "/staff/getStaff")
      .then((res) => {
        const sortedList = res.data.sort((a, b) => b.id - a.id);
        setInboundData(sortedList);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    reloadTable();
  }, []);

  useEffect(() => {
    let filtered = inboundData;

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(
        (item) => item.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply search filter
    if (search.trim() !== "") {
      filtered = filtered.filter((item) => {
        return (
          (item.id &&
            typeof item.id === "string" &&
            item.id.includes(search)) ||
          (item.staff_name &&
            item.staff_name.toLowerCase().includes(search.toLowerCase())) ||
          (item.staff_code &&
            item.staff_code.toLowerCase().includes(search.toLowerCase()))
        );
      });
    }

    setFilteredData(filtered);
  }, [search, inboundData, statusFilter]); // Trigger on statusFilter change

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) =>
        row.firstName + " " + row.middleName + " " + row.lastName,
      sortable: true,
    },
    {
      name: "Employee No.",
      selector: (row) => row.employeeNo,
      sortable: true,
    },
    {
      name: "Initial",
      selector: (row) => row.initial,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) =>
        row.status === "Active" ? (
          <span style={{ color: "green" }}>✔</span>
        ) : (
          <span style={{ color: "red" }}>✘</span>
        ),
    },
  ];

  const userData = filteredData.map((data, i) => ({
    key: i,
    id: data.id,
    firstName: data.first_name,
    middleName: data.middle_name,
    lastName: data.last_name,
    initial: data.initial,
    employeeNo: data.employee_no,
    designation: data.designation,
    status: data.status,
    contact: data.contact,
    email: data.email,
    department: data.department_id,
    username: data.username,
    password: data.password,
    userRole: data.col_id,
  }));

  const handleUpdateModalToggle = (row) => {
    setSelectedStaff(row);
    setShowUpdateModal(true);
  };

  // Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(userData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Staffs");
    XLSX.writeFile(wb, "Staff_List.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Staff List", 20, 10);
    doc.autoTable({
      head: [
        [
          "ID",
          "First Name",
          "Middle Name",
          "Last Name",
          "Designation",
          "Initial",
          "Status",
        ],
      ],
      body: userData.map((row) => [
        row.id,
        row.firstName,
        row.middleName,
        row.lastName,
        row.designation,
        row.initial,
        row.status,
      ]),
    });
    doc.save("Staff_List.pdf");
  };

  return (
    <div className="h-100 w-100 border bg-white custom-container">
      <div className="w-100 p-2 d-flex flex-row justify-content-between">
        <div className="d-flex flex-column title-custom">
          <span className="fs-3">Staff</span>
          <span>Staff LIST</span>
        </div>

        <div>
          <button
            className="btn btn-primary"
            onClick={handleShowCreateStaffModal}
          >
            Add New
          </button>
        </div>
      </div>

      <div className="w-100 row mx-0 mt-3">
        <div className="col-sm mb-2">
          {/* Status Filter Dropdown */}
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="col-sm mb-2">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="col-sm text-end mb-2">
          <button
            className="btn btn-secondary"
            onClick={() => {
              setSearch("");
              setStatusFilter(""); // Clear both filters
            }}
          >
            Clear Filter
          </button>
        </div>
      </div>

      <div className="w-100 d-flex justify-content-end mb-3">
        <button className="btn btn-success me-2" onClick={exportToExcel}>
          Export to Excel
        </button>
        <button className="btn btn-danger" onClick={exportToPDF}>
          Export to PDF
        </button>
      </div>

      <div className="w-100 mt-4 container-fluid">
        <DataTable
          columns={columns}
          data={userData}
          pagination
          sorting
          onRowClicked={(row) => handleUpdateModalToggle(row)}
        />
      </div>

      <CreateStaff
        show={showCreateStaffModal}
        handleClose={handleCloseCreateStaffModal}
        reloadTable={reloadTable}
      />

      <UpdateModal
        show={showUpdateModal}
        handleClose={() => setShowUpdateModal(false)}
        reloadTable={reloadTable}
        staffData={selectedStaff}
      />
    </div>
  );
}

export default Staff;
