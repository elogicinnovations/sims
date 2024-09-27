import React from "react";
import DataTable from "react-data-table-component";

function Department() {
  return (
    <div className="h-100 w-100 border bg-white custom-container">
      <div className="w-100 p-2 d-flex flex-row justify-content-between">
        <div className="d-flex flex-column title-custom">
          <span className="fs-3">Department</span>
          <span>Department LIST</span>
        </div>

        <div>
          <button className="btn btn-primary">Add New</button>
        </div>
      </div>
      <div className="w-100 row mx-0 mt-3">
        <div className="col-sm text-end mb-2">
          <button className="btn btn-secondary">Clear Filter</button>
        </div>
        <div className="col-sm mb-2">
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Search" />
          </div>
        </div>
      </div>
      <div className="w-100 mt-4 container-fluid">
        <DataTable pagination />
      </div>
    </div>
  );
}

export default Department;
