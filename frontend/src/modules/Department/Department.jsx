import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import BASE_URL from "../../assets/global/url";
import axios from "axios";
import CreateDepartment from "./createModal";

function Department() {
  const [filteredData, setFilteredData] = useState([]);
  const [inboundData, setInboundData] = useState([]);
  const [search, setSearch] = useState("");

  const [showCreateDepartmentModal, setShowCreateDepartmentModal] =
    useState(false);
  const handleShowCreateDepartmentModal = () =>
    setShowCreateDepartmentModal(true);
  const handleCloseCreateDepartmentModal = () =>
    setShowCreateDepartmentModal(false);

  const reloadTable = () => {
    axios
      .get(BASE_URL + "/department/getDepartment")
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
    if (search.trim() === "") {
      setFilteredData(inboundData);
    } else {
      const filtered = inboundData.filter((item) => {
        return (
          (item.id &&
            typeof item.id === "string" &&
            item.id.includes(search)) ||
          (item.department_name &&
            item.department_name
              .toLowerCase()
              .includes(search.toLowerCase())) ||
          (item.status &&
            item.status.toLowerCase().includes(search.toLowerCase())) ||
          (item.department_code &&
            item.department_code.toLowerCase().includes(search.toLowerCase()))
        );
      });
      setFilteredData(filtered);
    }
  }, [search, inboundData]);

  const columns = [
    {
      name: "ID",
      selector: (row) => row.id,
    },
    {
      name: "Department Name",
      selector: (row) => row.departmentName,
    },
    {
      name: "Department Code",
      selector: (row) => row.departmentCode,
    },
    {
      name: "Status",
      selector: (row) => (
        <span style={{ color: row.status === "Active" ? "green" : "red" }}>
          {row.status}
        </span>
      ),
    },
  ];

  const userData = filteredData.map((data, i) => ({
    key: i,
    id: data.id,
    departmentName: data.department_name,
    departmentCode: data.department_code,
    status: data.status,
  }));

  return (
    <div className="h-100 w-100 border bg-white custom-container">
      <div className="w-100 p-2 d-flex flex-row justify-content-between">
        <div className="d-flex flex-column title-custom">
          <span className="fs-3">Department</span>
          <span>Department LIST</span>
        </div>

        <div>
          <button
            className="btn btn-primary"
            onClick={handleShowCreateDepartmentModal}
          >
            Add New
          </button>
        </div>
      </div>
      <div className="w-100 row mx-0 mt-3">
        <div className="col-sm text-end mb-2">
          <button className="btn btn-secondary">Clear Filter</button>
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
      </div>
      <div className="w-100 mt-4 container-fluid">
        <DataTable columns={columns} data={userData} pagination />
      </div>

      <CreateDepartment
        show={showCreateDepartmentModal}
        handleClose={handleCloseCreateDepartmentModal}
      />
    </div>
  );
}

export default Department;
