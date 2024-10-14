import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import BASE_URL from "../../assets/global/url";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import CreateRequirement from "./createModal";
import UpdateModal from "./updateModal";

function Requirement() {
  const [filteredData, setFilteredData] = useState([]);
  const [inboundData, setInboundData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // Status filter state

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);

  const [showCreateRequirementModal, setShowCreateRequirementModal] =
    useState(false);
  const handleShowCreateRequirementModal = () =>
    setShowCreateRequirementModal(true);
  const handleCloseCreateRequirementModal = () =>
    setShowCreateRequirementModal(false);

  const reloadTable = () => {
    axios
      .get(BASE_URL + "/requirement/getRequirement")
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
          (item.requirement_name &&
            item.requirement_name
              .toLowerCase()
              .includes(search.toLowerCase())) ||
          (item.requirement_type &&
            item.requirement_type.toLowerCase().includes(search.toLowerCase()))
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
      name: "Requirement Name",
      selector: (row) => row.requirementName,
      sortable: true,
    },
    {
      name: "Requirement Type",
      selector: (row) => row.requirementType,
      sortable: true,
    },
    {
      name: "Required",
      selector: (row) =>
        row.required === "Active" ? (
          <span style={{ color: "green" }}>✔</span>
        ) : (
          <span style={{ color: "red" }}>✘</span>
        ),
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
    requirementName: data.requirement_name,
    requirementType: data.requirement_type,
    status: data.status,
    required: data.required,
  }));

  const handleUpdateModalToggle = (row) => {
    setSelectedRequirement(row);
    setShowUpdateModal(true);
  };

  // Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(userData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Requirements");
    XLSX.writeFile(wb, "Requirement_List.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Requirement List", 20, 10);
    doc.autoTable({
      head: [["ID", "Requirement Name", "Requirement Type", "Status"]],
      body: userData.map((row) => [
        row.id,
        row.requirementName,
        row.requirementType,
        row.status,
      ]),
    });
    doc.save("Requirement_List.pdf");
  };

  return (
    <div className="h-100 w-100 border bg-white custom-container">
      <div className="w-100 p-2 d-flex flex-row justify-content-between">
        <div className="d-flex flex-column title-custom">
          <span className="fs-3">Requirement</span>
          <span>Requirement LIST</span>
        </div>

        <div>
          <button
            className="btn btn-primary"
            onClick={handleShowCreateRequirementModal}
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

      <CreateRequirement
        show={showCreateRequirementModal}
        handleClose={handleCloseCreateRequirementModal}
        reloadTable={reloadTable}
      />

      <UpdateModal
        show={showUpdateModal}
        handleClose={() => setShowUpdateModal(false)}
        reloadTable={reloadTable}
        requirementData={selectedRequirement}
      />
    </div>
  );
}

export default Requirement;
