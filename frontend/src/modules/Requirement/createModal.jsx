import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"; // Import SweetAlert 1
import BASE_URL from "../../assets/global/url";

const CreateModal = ({ show, handleClose, reloadTable }) => {
  const [requirementName, setRequirementName] = useState("");
  const [requirementType, setRequirementType] = useState("");
  const [status, setStatus] = useState(false);
  const [required, setRequired] = useState(false);

  const [nameError, setNameError] = useState(false);
  const [codeError, setCodeError] = useState(false);

  const createRequirement = async (e) => {
    e.preventDefault();

    // Basic form validations
    let hasError = false;

    if (!requirementName.trim()) {
      setNameError(true);
      hasError = true;
    } else {
      setNameError(false);
    }

    if (!requirementType.trim()) {
      setCodeError(true);
      hasError = true;
    } else {
      setCodeError(false);
    }

    if (hasError) {
      swal(
        "Validation Error",
        "Both Requirement Name and Requirement Type are required.",
        "warning"
      );
      return;
    }

    const newRequirement = {
      requirementName,
      requirementType,
      status: status ? "Active" : "Inactive",
      required: required ? "Active" : "Inactive",
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/requirement/createRequirement`,
        newRequirement
      );

      if (response.status === 200) {
        swal("Success", "Requirement created successfully.", "success");

        // Reload the table and clear inputs
        reloadTable();
        setRequirementName("");
        setRequirementType("");
        setStatus(false);
        setRequired(false);
        handleClose(); // Close the modal
      } else if (response.status === 201) {
        swal("Duplicate Entry", "This requirement already exists.", "info");
      }
    } catch (err) {
      swal(
        "Error",
        "An error occurred while creating the requirement.",
        "error"
      );
      console.error("Error creating requirement", err);
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
        <Form noValidate onSubmit={createRequirement}>
          <Modal.Header className="border-0">
            <Modal.Title>
              <h2>Add New Requirement</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="requirementName">
                  <Form.Label>Requirement Name</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={requirementName}
                    onChange={(e) => setRequirementName(e.target.value)}
                    className={nameError ? "is-invalid" : ""}
                  />
                  {nameError && (
                    <Form.Control.Feedback type="invalid">
                      Requirement Name is required.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="requirementType">
                  <Form.Label>Requirement Type</Form.Label>
                  <Form.Select
                    required
                    value={requirementType}
                    onChange={(e) => setRequirementType(e.target.value)}
                    className={codeError ? "is-invalid" : ""}
                  >
                    <option value="">Select Requirement Type</option>
                    <option value="Application">Application</option>
                    <option value="Graduate">Graduate</option>
                  </Form.Select>
                  {codeError && (
                    <Form.Control.Feedback type="invalid">
                      Requirement Type is required.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className=" col-sm">
                <Form.Group>
                  <div className="mt-2 row mb-2">
                    <label className="col-sm-3 col-form-label">Required?</label>
                    <div className="col-sm-9 d-flex flex-row align-items-center">
                      <label className="switch">
                        <input
                          type="checkbox"
                          id="required"
                          checked={required}
                          onChange={(e) => setRequired(e.target.checked)}
                        />
                        <span className="slider round"></span>
                      </label>
                      <label htmlFor="required">
                        {required ? "Active" : "Inactive"}
                      </label>
                    </div>
                  </div>
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
