import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useParams } from "react-router-dom"; // For accessing route params
import BASE_URL from "../../assets/global/url";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import CreateSubject from "./createModal";
import UpdateModal from "./updateModal";
import { Button } from "react-bootstrap";

function Subject() {
  const { courseId } = useParams();
  const [filteredData, setFilteredData] = useState([]);
  const [inboundData, setInboundData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [courseName, setCourseName] = useState("");

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const [showCreateSubjectModal, setShowCreateSubjectModal] = useState(false);
  const handleShowCreateSubjectModal = () => setShowCreateSubjectModal(true);
  const handleCloseCreateSubjectModal = () => setShowCreateSubjectModal(false);

  const reloadTable = () => {
    axios
      .get(`${BASE_URL}/subject/getSubject?course_id=${courseId}`)
      .then((res) => {
        const sortedList = res.data.sort((a, b) => b.id - a.id);
        setInboundData(sortedList);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const fetchCourseName = () => {
      axios
        .get(`${BASE_URL}/subject/getCourseNameById?course_id=${courseId}`)
        .then((res) => {
          setCourseName(res.data.courseName);
        })
        .catch((err) => console.log(err));
    };

    fetchCourseName();
    reloadTable();
  }, [courseId]);

  useEffect(() => {
    let filtered = inboundData;

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
          (item.subject_name &&
            item.subject_name.toLowerCase().includes(search.toLowerCase())) ||
          (item.subject_code &&
            item.subject_code.toLowerCase().includes(search.toLowerCase()))
        );
      });
    }

    setFilteredData(filtered);
  }, [search, inboundData, statusFilter]);

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Subject Name",
      selector: (row) => row.subjectName,
      sortable: true,
    },
    {
      name: "Subject Code",
      selector: (row) => row.subjectCode,
      sortable: true,
    },
    {
      name: "Unit",
      selector: (row) => row.unit,
      sortable: true,
    },
    {
      name: "Term",
      selector: (row) => row.term,
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
    {
      name: "Competency",
      selector: (row) =>
        row.competency === "Active" ? (
          <span style={{ color: "green" }}>✔</span>
        ) : (
          <span style={{ color: "red" }}>✘</span>
        ),
      sortable: true,
    },
  ];

  const userData = filteredData.map((data, i) => ({
    key: i,
    id: data.id,
    subjectName: data.subject_name,
    subjectCode: data.subject_code,
    status: data.status,
    term: data.term,
    unit: data.unit,
    unitHours: data.unit_hours,
    numeric: data.numeric,
    competency: data.competency,
  }));

  const handleUpdateModalToggle = (row) => {
    setSelectedSubject(row);
    setShowUpdateModal(true);
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(userData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Subject");
    XLSX.writeFile(wb, "Subject_List.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Subject List", 20, 10);
    doc.autoTable({
      head: [["ID", "Subject Name", "Subject Code", "Status"]],
      body: userData.map((row) => [
        row.id,
        row.subjectName,
        row.subjectCode,
        row.status,
        row.term,
        row.unit,
        row.unitHours,
        row.numeric,
        row.competency,
      ]),
    });
    doc.save("Subject_List.pdf");
  };

  return (
    <div className="h-100 w-100 border bg-white custom-container">
      <div className="w-100 p-2 d-flex flex-row justify-content-between">
        <div className="d-flex flex-column title-custom">
          <span className="fs-3">Subjects for Course: {courseName}</span>
          <span>Subject LIST</span>
        </div>

        <div>
          <button
            className="btn btn-primary"
            onClick={handleShowCreateSubjectModal}
          >
            Add New
          </button>
        </div>
      </div>

      <div className="w-100 row mx-0 mt-3">
        <div className="col-sm mb-2">
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

      <DataTable
        columns={columns}
        data={userData}
        pagination
        sorting
        onRowClicked={(row) => handleUpdateModalToggle(row)}
      />

      <CreateSubject
        show={showCreateSubjectModal}
        handleClose={handleCloseCreateSubjectModal}
        reloadTable={reloadTable}
        courseId={courseId}
      />

      <UpdateModal
        show={showUpdateModal}
        handleClose={() => setShowUpdateModal(false)}
        reloadTable={reloadTable}
        subjectData={selectedSubject}
      />
    </div>
  );
}

export default Subject;
