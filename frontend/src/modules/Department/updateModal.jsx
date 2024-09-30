import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"; // Import SweetAlert 1
import BASE_URL from "../../assets/global/url";

const UpdateModal = ({ show, handleClose, reloadTable, departmentData }) => {
  const [departmentId, setDepartmentId] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");
  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (departmentData) {
      setDepartmentId(departmentData.id);
      setDepartmentName(departmentData.departmentName);
      setDepartmentCode(departmentData.departmentCode);
      setStatus(departmentData.status === "Active");
    }
  }, [departmentData]);

  const updateDepartment = async (e) => {
    e.preventDefault();

    // Basic form validations
    if (!departmentName.trim() || !departmentCode.trim()) {
      swal(
        "Validation Error",
        "Both Department Name and Department Code are required.",
        "warning"
      );
      return;
    }

    const updatedDepartment = {
      departmentId,
      departmentName,
      departmentCode,
      status: status ? "Active" : "Inactive",
    };

    try {
      const response = await axios.put(
        `${BASE_URL}/department/updateDepartment/${updatedDepartment.departmentId}`, // Update this to your actual endpoint
        updatedDepartment
      );

      if (response.status === 200) {
        swal("Success", "Department updated successfully.", "success");

        // Reload the table and clear inputs
        reloadTable();
        handleClose(); // Close the modal
      }
    } catch (err) {
      console.error("Update error:", err);
      swal(
        "Error",
        "An error occurred while updating the department.",
        "error"
      );
      console.error("Error updating department", err);
    }
  };

  return (
    <div>
      <Modal
        backdrop={false}
        show={show}
        onHide={handleClose}
        animation={false}
      >
        <Form noValidate onSubmit={updateDepartment}>
          <Modal.Header className="border-0">
            <Modal.Title>
              <h2>Update Department {departmentId}</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="departmentName">
                  <Form.Label>Department Name</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="departmentCode">
                  <Form.Label>Department Code</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={departmentCode}
                    onChange={(e) => setDepartmentCode(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <Form.Group>
                  <div className="mt-2 row mb-2">
                    <label className="col-sm-3 col-form-label">Status</label>
                    <div className="col-sm-9 d-flex flex-row align-items-center">
                      <label className="switch">
                        <input
                          type="checkbox"
                          id="status"
                          checked={status}
                          onChange={(e) => setStatus(e.target.checked)}
                        />
                        <span className="slider round"></span>
                      </label>
                      <label htmlFor="status">
                        {status ? "Active" : "Inactive"}
                      </label>
                    </div>
                  </div>
                </Form.Group>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Update
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdateModal;
