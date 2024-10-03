import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"; // Import SweetAlert 1
import BASE_URL from "../../assets/global/url";

const UpdateModal = ({ show, handleClose, reloadTable, subjectData }) => {
  const [subjectId, setSubjectId] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [status, setStatus] = useState(false);
  const [term, setTerm] = useState("");
  const [unit, setUnit] = useState("");
  const [unitHours, setUnitHours] = useState("");
  const [numeric, setNumeric] = useState(false);
  const [competency, setCompetency] = useState(false);

  const [nameError, setNameError] = useState(false);
  const [codeError, setCodeError] = useState(false);

  useEffect(() => {
    if (subjectData) {
      setSubjectId(subjectData.id);
      setSubjectName(subjectData.subjectName);
      setSubjectCode(subjectData.subjectCode);
      setStatus(subjectData.status === "Active");
      setTerm(subjectData.term);
      setUnit(subjectData.unit);
      setUnitHours(subjectData.unitHours);
      setNumeric(subjectData.numeric === "Active");
      setCompetency(subjectData.competency === "Active");
    }
  }, [subjectData]);

  const updateSubject = async (e) => {
    e.preventDefault();

    // Basic form validations
    if (!subjectName.trim() || !subjectCode.trim()) {
      swal(
        "Validation Error",
        "Both Subject Name and Subject Code are required.",
        "warning"
      );
      return;
    }

    const updatedSubject = {
      subjectId,
      subjectName,
      subjectCode,
      status: status ? "Active" : "Inactive",
      term,
      unit,
      unitHours,
      numeric: numeric ? "Active" : "Inactive",
      competency: competency ? "Active" : "Inactive",
    };

    try {
      const response = await axios.put(
        `${BASE_URL}/subject/updateSubject/${updatedSubject.subjectId}`, // Update this to your actual endpoint
        updatedSubject
      );

      if (response.status === 200) {
        swal("Success", "Subject updated successfully.", "success");

        // Reload the table and clear inputs
        reloadTable();
        handleClose(); // Close the modal
      }
    } catch (err) {
      console.error("Update error:", err);
      swal("Error", "An error occurred while updating the subject.", "error");
      console.error("Error updating subject", err);
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
        <Form noValidate onSubmit={updateSubject}>
          <Modal.Header className="border-0">
            <Modal.Title>
              <h2>Update Subject</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="subjectCode">
                  <Form.Label>Subject Code</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    className={codeError ? "is-invalid" : ""}
                  />
                  {codeError && (
                    <Form.Control.Feedback type="invalid">
                      Subject Code is required.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="subjectName">
                  <Form.Label>Subject Name</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    className={nameError ? "is-invalid" : ""}
                  />
                  {nameError && (
                    <Form.Control.Feedback type="invalid">
                      Subject Name is required.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="term">
                  <Form.Label>Term</Form.Label>
                  <Form.Select
                    required
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                  >
                    <option value="">Select a Term</option>
                    <option value="1st Term">1st Term</option>
                    <option value="2nd Term">2nd Term</option>
                    <option value="3rd Term">3rd Term</option>
                    <option value="4th Term">4th Term</option>
                    <option value="5th Term">5th Term</option>
                    <option value="6th Term">6th Term</option>
                    <option value="7th Term">7th Term</option>
                    <option value="8th Term">8th Term</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="unit">
                  <Form.Label>Unit</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="unitHours">
                  <Form.Label>Unit Hours</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={unitHours}
                    onChange={(e) => setUnitHours(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className=" col-sm">
                <Form.Group>
                  <div className="mt-2 row mb-2">
                    <label className="col-sm-3 col-form-label">
                      is Numeric? {numeric}
                    </label>
                    <div className="col-sm-9 d-flex flex-row align-items-center">
                      <label className="switch">
                        <input
                          type="checkbox"
                          id="numeric"
                          checked={numeric}
                          onChange={(e) => setNumeric(e.target.checked)}
                        />
                        <span className="slider round"></span>
                      </label>
                      <label htmlFor="numeric">
                        {numeric ? "Active" : "Inactive"}
                      </label>
                    </div>
                  </div>
                </Form.Group>
                <Form.Group>
                  <div className="mt-2 row mb-2">
                    <label className="col-sm-3 col-form-label">
                      Competency? {competency}
                    </label>
                    <div className="col-sm-9 d-flex flex-row align-items-center">
                      <label className="switch">
                        <input
                          type="checkbox"
                          id="competency"
                          checked={competency}
                          onChange={(e) => setCompetency(e.target.checked)}
                        />
                        <span className="slider round"></span>
                      </label>
                      <label htmlFor="competency">
                        {competency ? "Active" : "Inactive"}
                      </label>
                    </div>
                  </div>
                </Form.Group>
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
