import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"; // Import SweetAlert 1
import BASE_URL from "../../assets/global/url";

const UpdateModal = ({ show, handleClose, reloadTable, requirementData }) => {
  const [requirementId, setRequirementId] = useState("");
  const [requirementName, setRequirementName] = useState("");
  const [requirementType, setRequirementType] = useState("");
  const [status, setStatus] = useState(false);
  const [required, setRequired] = useState(false);

  useEffect(() => {
    if (requirementData) {
      setRequirementId(requirementData.id);
      setRequirementName(requirementData.requirementName);
      setRequirementType(requirementData.requirementType);
      setStatus(requirementData.status === "Active");
      setRequired(requirementData.required === "Active");
    }
  }, [requirementData]);

  const updateRequirement = async (e) => {
    e.preventDefault();

    // Basic form validations
    if (!requirementName.trim() || !requirementType.trim()) {
      swal(
        "Validation Error",
        "Both Requirement Name and Requirement Type are required.",
        "warning"
      );
      return;
    }

    const updatedRequirement = {
      requirementId,
      requirementName,
      requirementType,
      status: status ? "Active" : "Inactive",
      required: required ? "Active" : "Inactive",
    };

    try {
      const response = await axios.put(
        `${BASE_URL}/requirement/updateRequirement/${updatedRequirement.requirementId}`, // Update this to your actual endpoint
        updatedRequirement
      );

      if (response.status === 200) {
        swal("Success", "Requirement updated successfully.", "success");

        // Reload the table and clear inputs
        reloadTable();
        handleClose(); // Close the modal
      }
    } catch (err) {
      console.error("Update error:", err);
      swal(
        "Error",
        "An error occurred while updating the requirement.",
        "error"
      );
      console.error("Error updating requirement", err);
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
        <Form noValidate onSubmit={updateRequirement}>
          <Modal.Header className="border-0">
            <Modal.Title>
              <h2>Update Requirement {requirementId}</h2>
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
                  />
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
                  >
                    <option value="">Select Requirement Type</option>
                    <option value="Application">Application</option>
                    <option value="Graduate">Graduate</option>
                  </Form.Select>
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
