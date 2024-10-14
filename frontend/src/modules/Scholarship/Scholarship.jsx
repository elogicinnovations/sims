import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import BASE_URL from "../../assets/global/url";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import CreateScholarship from "./createModal";
import UpdateModal from "./updateModal";

function Scholarship() {
  const [filteredData, setFilteredData] = useState([]);
  const [inboundData, setInboundData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // Status filter state

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState(null);

  const [sponsorDate, setSponsorDate] = useState(null);

  const [showCreateScholarshipModal, setShowCreateScholarshipModal] =
    useState(false);
  const handleShowCreateScholarshipModal = () =>
    setShowCreateScholarshipModal(true);
  const handleCloseCreateScholarshipModal = () =>
    setShowCreateScholarshipModal(false);

  const reloadTable = () => {
    axios
      .get(BASE_URL + "/scholarship/getScholarship")
      .then((res) => {
        const sortedList = res.data.sort((a, b) => b.id - a.id);
        const formattedDate = new Date(res.sponsor_date).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }
        );
        setSponsorDate(formattedDate);
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
          (item.sponsor_name &&
            item.sponsor_name.toLowerCase().includes(search.toLowerCase())) ||
          (item.sponsor_date &&
            typeof item.sponsor_date === "string" &&
            item.sponsor_date.includes(search))
        );
      });
    }

    setFilteredData(filtered);
  }, [search, inboundData, statusFilter]); // Trigger on statusFilter change

  const columns = [
    {
      name: "ID",
      selector: (row) => row.scholarhsipId,
      sortable: true,
    },
    {
      name: "Sponsor Name",
      selector: (row) => row.sponsorName,
      sortable: true,
    },
    {
      name: "Date Sponsored",
      selector: (row) => row.sponsorDate,
      sortable: true,
    },
    {
      name: "Contact Person",
      selector: (row) => row.contactPerson,
      sortable: true,
    },
    {
      name: "Contact No.",
      selector: (row) => row.contactNo,
      sortable: true,
    },
    {
      name: "Tuition",
      selector: (row) => row.tuition,
      sortable: true,
    },
    {
      name: "Subsistence",
      selector: (row) => row.subsistence,
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

  const userData = filteredData.map((data, i) => {
    const sponsorDate = new Date(data.sponsor_date);
    const formattedDate = sponsorDate.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return {
      key: i,
      scholarhsipId: data.id,
      sponsorName: data.sponsor_name,
      sponsorDate: formattedDate,
      contactPerson: data.contact_person,
      contactNo: data.contact_number,
      tuition: data.tuition,
      subsistence: data.subsistence,
      status: data.status,
      address: data.address,
      email: data.email,
    };
  });

  const handleUpdateModalToggle = (row) => {
    setSelectedScholarship(row);
    setShowUpdateModal(true);
  };

  // Export to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(userData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Scholarships");
    XLSX.writeFile(wb, "Scholarship_Foundation_List.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Scholarship List", 20, 10);
    doc.autoTable({
      head: [
        [
          "ID",
          "Sponsor Name",
          "Sponsored Date",
          "Contact Person",
          "Contact No.",
          "Tuition",
          "Subsistence",
          "Status",
        ],
      ],
      body: userData.map((row) => [
        row.id,
        row.sponsorName,
        row.sponsorDate,
        row.contactPerson,
        row.contactNo,
        row.tuition,
        row.subsistence,
        row.status,
      ]),
    });
    doc.save("Scholarship_Foundation_List.pdf");
  };

  return (
    <div className="h-100 w-100 border bg-white custom-container">
      <div className="w-100 p-2 d-flex flex-row justify-content-between">
        <div className="d-flex flex-column title-custom">
          <span className="fs-3">Scholarship</span>
          <span>Scholarship LIST</span>
        </div>

        <div>
          <button
            className="btn btn-primary"
            onClick={handleShowCreateScholarshipModal}
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

      <CreateScholarship
        show={showCreateScholarshipModal}
        handleClose={handleCloseCreateScholarshipModal}
        reloadTable={reloadTable}
      />

      <UpdateModal
        show={showUpdateModal}
        handleClose={() => setShowUpdateModal(false)}
        reloadTable={reloadTable}
        scholarshipData={selectedScholarship}
      />
    </div>
  );
}

export default Scholarship;
