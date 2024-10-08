import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"; // Import SweetAlert 1
import BASE_URL from "../../assets/global/url";

const CreateModal = ({ show, handleClose, reloadTable }) => {
  const [departmentName, setDepartmentName] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");
  const [status, setStatus] = useState(false);

  const [nameError, setNameError] = useState(false);
  const [codeError, setCodeError] = useState(false);

  const createDepartment = async (e) => {
    e.preventDefault();

    // Basic form validations
    let hasError = false;

    if (!departmentName.trim()) {
      setNameError(true);
      hasError = true;
    } else {
      setNameError(false);
    }

    if (!departmentCode.trim()) {
      setCodeError(true);
      hasError = true;
    } else {
      setCodeError(false);
    }

    if (hasError) {
      swal(
        "Validation Error",
        "Both Department Name and Department Code are required.",
        "warning"
      );
      return;
    }

    const newDepartment = {
      departmentName,
      departmentCode,
      status: status ? "Active" : "Inactive",
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/department/createDepartment`,
        newDepartment
      );

      if (response.status === 200) {
        swal("Success", "Department created successfully.", "success");

        // Reload the table and clear inputs
        reloadTable();
        setDepartmentName("");
        setDepartmentCode("");
        setStatus(false);
        handleClose(); // Close the modal
      } else if (response.status === 201) {
        swal("Duplicate Entry", "This department already exists.", "info");
      }
    } catch (err) {
      swal(
        "Error",
        "An error occurred while creating the department.",
        "error"
      );
      console.error("Error creating department", err);
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
        <Form noValidate onSubmit={createDepartment}>
          <Modal.Header className="border-0">
            <Modal.Title>
              <h2>Add New Department</h2>
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
                    className={nameError ? "is-invalid" : ""}
                  />
                  {nameError && (
                    <Form.Control.Feedback type="invalid">
                      Department Name is required.
                    </Form.Control.Feedback>
                  )}
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
                    className={codeError ? "is-invalid" : ""}
                  />
                  {codeError && (
                    <Form.Control.Feedback type="invalid">
                      Department Code is required.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className=" col-sm">
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
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateModal;
