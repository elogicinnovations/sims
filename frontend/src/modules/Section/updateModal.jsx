import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"; // Import SweetAlert 1
import BASE_URL from "../../assets/global/url";

const UpdateModal = ({ show, handleClose, reloadTable, sectionData }) => {
  const [sectionId, setSectionId] = useState("");
  const [sectionName, setSectionName] = useState("");
  const [sectionCode, setSectionCode] = useState("");
  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (sectionData) {
      setSectionId(sectionData.id);
      setSectionName(sectionData.sectionName);
      setSectionCode(sectionData.sectionCode);
      setStatus(sectionData.status === "Active");
    }
  }, [sectionData]);

  const updateSection = async (e) => {
    e.preventDefault();

    // Basic form validations
    if (!sectionName.trim() || !sectionCode.trim()) {
      swal(
        "Validation Error",
        "Both Section Name and Section Code are required.",
        "warning"
      );
      return;
    }

    const updatedSection = {
      sectionId,
      sectionName,
      sectionCode,
      status: status ? "Active" : "Inactive",
    };

    try {
      const response = await axios.put(
        `${BASE_URL}/section/updateSection/${updatedSection.sectionId}`, // Update this to your actual endpoint
        updatedSection
      );

      if (response.status === 200) {
        swal("Success", "Section updated successfully.", "success");

        // Reload the table and clear inputs
        reloadTable();
        handleClose(); // Close the modal
      }
    } catch (err) {
      console.error("Update error:", err);
      swal("Error", "An error occurred while updating the section.", "error");
      console.error("Error updating section", err);
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
        <Form noValidate onSubmit={updateSection}>
          <Modal.Header className="border-0">
            <Modal.Title>
              <h2>Update Section {sectionId}</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="sectionName">
                  <Form.Label>Section Name</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={sectionName}
                    onChange={(e) => setSectionName(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="sectionCode">
                  <Form.Label>Section Code</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={sectionCode}
                    onChange={(e) => setSectionCode(e.target.value)}
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
