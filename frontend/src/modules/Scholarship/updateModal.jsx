import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"; // Import SweetAlert 1
import BASE_URL from "../../assets/global/url";

const UpdateModal = ({ show, handleClose, reloadTable, scholarshipData }) => {
  const [scholarhsipId, setScholarshipId] = useState("");
  const [sponsorName, setSponsorName] = useState("");
  const [sponsorDate, setSponsorDate] = useState("");
  const [tuition, setTuition] = useState(0);
  const [subsistence, setSubsistence] = useState(0);
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (scholarshipData) {
      setScholarshipId(scholarshipData.scholarhsipId);
      setSponsorName(scholarshipData.sponsorName);
      setSponsorDate(scholarshipData.sponsorDate);
      setTuition(scholarshipData.tuition);
      setSubsistence(scholarshipData.subsistence);
      setAddress(scholarshipData.address);
      setEmail(scholarshipData.email);
      setContactPerson(scholarshipData.contactPerson);
      setContactNo(scholarshipData.contactNo);
      setStatus(scholarshipData.status === "Active");
    }
  }, [scholarshipData]);

  const updateScholarship = async (e) => {
    e.preventDefault();

    // Basic form validations
    if (!sponsorName.trim()) {
      swal("Validation Error", "Both Sponsor Name are required.", "warning");
      return;
    }

    const updatedScholarship = {
      scholarhsipId,
      sponsorName,
      sponsorDate,
      tuition,
      subsistence,
      address,
      email,
      contactPerson,
      contactNo,
      status: status ? "Active" : "Inactive",
    };

    try {
      const response = await axios.put(
        `${BASE_URL}/scholarship/updateScholarship/${updatedScholarship.scholarhsipId}`,
        updatedScholarship
      );

      if (response.status === 200) {
        swal("Success", "Scholarship updated successfully.", "success");

        reloadTable();
        handleClose();
      } else if (response.status === 202) {
        swal("Validation Error", "Sponsor name already exist.", "warning");
        return;
      }
    } catch (err) {
      console.error("Update error:", err);
      swal(
        "Error",
        "An error occurred while updating the scholarship.",
        "error"
      );
      console.error("Error updating scholarship", err);
    }
  };

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    return "";
  };

  return (
    <div>
      <Modal
        backdrop={false}
        show={show}
        onHide={handleClose}
        animation={false}
      >
        <Form noValidate onSubmit={updateScholarship}>
          <Modal.Header className="border-0">
            <Modal.Title>
              <h2>Update Scholarship {scholarhsipId}</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="sponsorName">
                  <Form.Label>Sponsor Name</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={sponsorName}
                    onChange={(e) => setSponsorName(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="sponsorDate">
                  <Form.Label>Sponsor Date </Form.Label>
                  <Form.Control
                    type="date"
                    required
                    value={formatDateForInput(sponsorDate)}
                    onChange={(e) => setSponsorDate(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="tuition">
                  <Form.Label>Tuition</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    value={tuition}
                    onChange={(e) => setTuition(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="subsistence">
                  <Form.Label>Subsistence</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    value={subsistence}
                    onChange={(e) => setSubsistence(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="contactPerson">
                  <Form.Label>Contact Person</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="contactNo">
                  <Form.Label>Contact Number</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                  />
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
              Update
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default UpdateModal;
