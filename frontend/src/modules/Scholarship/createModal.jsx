import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"; // Import SweetAlert 1
import BASE_URL from "../../assets/global/url";

const CreateModal = ({ show, handleClose, reloadTable }) => {
  const [sponsorName, setSponsorName] = useState("");
  const [sponsorDate, setSponsorDate] = useState("");
  const [tuition, setTuition] = useState(0);
  const [subsistence, setSubsistence] = useState(0);
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [status, setStatus] = useState(false);

  const [nameError, setNameError] = useState(false);

  const createSponsor = async (e) => {
    e.preventDefault();

    // Basic form validations
    let hasError = false;

    if (!sponsorName.trim()) {
      setNameError(true);
      hasError = true;
    } else {
      setNameError(false);
    }

    if (hasError) {
      swal("Validation Error", "Sponsor name are required.", "warning");
      return;
    }

    const newSponsor = {
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
      const response = await axios.post(
        `${BASE_URL}/scholarship/createScholarship`,
        newSponsor
      );

      if (response.status === 200) {
        swal("Success", "Sponsor created successfully.", "success");

        // Reload the table and clear inputs
        reloadTable();
        setSponsorName("");
        setSponsorDate(null);
        setTuition(0);
        setSubsistence(0);
        setAddress("");
        setEmail("");
        setContactPerson("");
        setContactNo("");
        setStatus(false);
        handleClose(); // Close the modal
      } else if (response.status === 201) {
        swal("Duplicate Entry", "This Sponsor already exists.", "info");
      }
    } catch (err) {
      swal("Error", "An error occurred while creating the sponsor.", "error");
      console.error("Error creating scholarship", err);
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
        <Form noValidate onSubmit={createSponsor}>
          <Modal.Header className="border-0">
            <Modal.Title>
              <h2>Add New Sponsor</h2>
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
                    className={nameError ? "is-invalid" : ""}
                  />
                  {nameError && (
                    <Form.Control.Feedback type="invalid">
                      Sponsor Name is required.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="sponsorDate">
                  <Form.Label>Sponsor Date</Form.Label>
                  <Form.Control
                    type="date"
                    required
                    value={sponsorDate}
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
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateModal;
