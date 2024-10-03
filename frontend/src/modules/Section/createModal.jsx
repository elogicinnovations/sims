import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"; // Import SweetAlert 1
import BASE_URL from "../../assets/global/url";

const CreateModal = ({ show, handleClose, reloadTable }) => {
  const [sectionName, setSectionName] = useState("");
  const [sectionCode, setSectionCode] = useState("");
  const [status, setStatus] = useState(false);

  const [nameError, setNameError] = useState(false);
  const [codeError, setCodeError] = useState(false);

  const createSection = async (e) => {
    e.preventDefault();

    // Basic form validations
    let hasError = false;

    if (!sectionName.trim()) {
      setNameError(true);
      hasError = true;
    } else {
      setNameError(false);
    }

    if (!sectionCode.trim()) {
      setCodeError(true);
      hasError = true;
    } else {
      setCodeError(false);
    }

    if (hasError) {
      swal(
        "Validation Error",
        "Both Section Name and Section Code are required.",
        "warning"
      );
      return;
    }

    const newSection = {
      sectionName,
      sectionCode,
      status: status ? "Active" : "Inactive",
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/section/createSection`,
        newSection
      );

      if (response.status === 200) {
        swal("Success", "Section created successfully.", "success");

        // Reload the table and clear inputs
        reloadTable();
        setSectionName("");
        setSectionCode("");
        setStatus(false);
        handleClose(); // Close the modal
      } else if (response.status === 201) {
        swal("Duplicate Entry", "This section already exists.", "info");
      }
    } catch (err) {
      swal("Error", "An error occurred while creating the section.", "error");
      console.error("Error creating section", err);
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
        <Form noValidate onSubmit={createSection}>
          <Modal.Header className="border-0">
            <Modal.Title>
              <h2>Add New Section</h2>
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
                    className={nameError ? "is-invalid" : ""}
                  />
                  {nameError && (
                    <Form.Control.Feedback type="invalid">
                      Section Name is required.
                    </Form.Control.Feedback>
                  )}
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
                    className={codeError ? "is-invalid" : ""}
                  />
                  {codeError && (
                    <Form.Control.Feedback type="invalid">
                      Section Code is required.
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
