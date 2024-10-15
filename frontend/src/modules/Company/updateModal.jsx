import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"; // Import SweetAlert 1
import BASE_URL from "../../assets/global/url";

const UpdateModal = ({ show, handleClose, reloadTable, companyData }) => {
  const [companyId, setCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [staff, setStaff] = useState(null);
  const [companyAddress, setCompanyAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [nationality, setNationality] = useState("");
  const [technicalCoordinator, setTechnicalCoordinator] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingSchedule, setBillingSchedule] = useState("");
  const [billingRemarks, setBillingRemarks] = useState("");
  const [status, setStatus] = useState(false);
  const [subsidyRate, setSubsidyRate] = useState(0);
  const [alumni, setAlumni] = useState("");
  const [wtChairman, setWtChairman] = useState("");
  const [products, setProducts] = useState("");
  const [trainingPlan, setTraningPlan] = useState("");
  const [trainingAssignment, setTrainingAssignment] = useState("");
  const [collectionAddress, setCollectionAddress] = useState("");
  const [collectionSchedule, setCollectionSchedule] = useState("");
  const [collectionRemarks, setCollectionRemarks] = useState("");
  const [others, setOthers] = useState("");
  const [email, setEmail] = useState("");

  const [staffMap, setStaffMap] = useState([]);

  const [nameError, setNameError] = useState(false);

  useEffect(() => {
    axios
      .get(BASE_URL + "/staff/getStaff")
      .then((response) => {
        const mappedStaffs = response.data.map((staff) => ({
          value: staff.id,
          label: staff.first_name + " " + staff.last_name,
        }));
        setStaffMap(mappedStaffs);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });
  }, []);

  useEffect(() => {
    if (companyData) {
      setCompanyId(companyData.companyId);
      setCompanyName(companyData.companyName);
      setStaff(companyData.staff);
      setCompanyAddress(companyData.companyAddress);
      setContactPerson(companyData.contactPerson);
      setContactNo(companyData.contactNo);
      setNationality(companyData.nationality);
      setTechnicalCoordinator(companyData.technicalCoordinator);
      setBillingAddress(companyData.billingAddress);
      setBillingSchedule(companyData.billingSchedule);
      setBillingRemarks(companyData.billingRemarks);
      setStatus(companyData.status === "Active");
      setSubsidyRate(companyData.subsidyRate);
      setAlumni(companyData.alumni);
      setWtChairman(companyData.wtChairman);
      setProducts(companyData.products);
      setTraningPlan(companyData.trainingPlan);
      setTrainingAssignment(companyData.trainingAssignment);
      setCollectionAddress(companyData.collectionAddress);
      setCollectionSchedule(companyData.collectionSchedule);
      setCollectionRemarks(companyData.collectionRemarks);
      setOthers(companyData.others);
      setEmail(companyData.email);
    }
  }, [companyData]);

  const updateCompany = async (e) => {
    e.preventDefault();

    // Basic form validations
    if (!companyName.trim()) {
      swal("Validation Error", "Both Company Name are required.", "warning");
      return;
    }

    const updatedCompany = {
      companyId,
      companyName,
      staff,
      companyAddress,
      contactPerson,
      contactNo,
      nationality,
      technicalCoordinator,
      billingAddress,
      billingSchedule,
      billingRemarks,
      status: status ? "Active" : "Inactive",
      subsidyRate,
      alumni,
      wtChairman,
      products,
      trainingPlan,
      trainingAssignment,
      collectionAddress,
      collectionSchedule,
      collectionRemarks,
      others,
      email,
    };

    try {
      const response = await axios.put(
        `${BASE_URL}/company/updateCompany/${updatedCompany.companyId}`, // Update this to your actual endpoint
        updatedCompany
      );

      if (response.status === 200) {
        swal("Success", "Company updated successfully.", "success");

        // Reload the table and clear inputs
        reloadTable();
        handleClose(); // Close the modal
      }
    } catch (err) {
      console.error("Update error:", err);
      swal("Error", "An error occurred while updating the company.", "error");
      console.error("Error updating company", err);
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
        <Form noValidate onSubmit={updateCompany}>
          <Modal.Header className="border-0">
            <Modal.Title>
              <h2>Update Company {companyId}</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="companyName">
                  <Form.Label>Company Name</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className={nameError ? "is-invalid" : ""}
                  />
                  {nameError && (
                    <Form.Control.Feedback type="invalid">
                      Company Name is required.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </div>
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="staff">
                  <Form.Label>Assign I.C.</Form.Label>
                  <Form.Select
                    onChange={(e) => setStaff(e.target.value)}
                    value={staff}
                    required
                  >
                    <option disabled value="">
                      Select I.C.
                    </option>
                    {staffMap.map((option) => (
                      <option value={option.value}>{option.label}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="companyAddress">
                  <Form.Label>Company Address</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                  />
                </Form.Group>
              </div>
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

              <div className="col-sm">
                <Form.Group className="mb-3" controlId="nationality">
                  <Form.Label>Nationality</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                  />
                </Form.Group>
              </div>

              <div className="col-sm">
                <Form.Group className="mb-3" controlId="technicalCoordinator">
                  <Form.Label>Technical Coordinator</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={technicalCoordinator}
                    onChange={(e) => setTechnicalCoordinator(e.target.value)}
                  />
                </Form.Group>
              </div>

              <div className="col-sm">
                <Form.Group className="mb-3" controlId="billingAddress">
                  <Form.Label>Billing Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                  />
                </Form.Group>
              </div>

              <div className="col-sm">
                <Form.Group className="mb-3" controlId="billingSchedule">
                  <Form.Label>Billing Schedule</Form.Label>
                  <Form.Control
                    type="text"
                    value={billingSchedule}
                    onChange={(e) => setBillingSchedule(e.target.value)}
                  />
                </Form.Group>
              </div>

              <div className="col-sm">
                <Form.Group className="mb-3" controlId="billingRemarks">
                  <Form.Label>Billing Remarks</Form.Label>
                  <Form.Control
                    type="text"
                    value={billingRemarks}
                    onChange={(e) => setBillingRemarks(e.target.value)}
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

              <div className="col-sm">
                <Form.Group className="mb-3" controlId="subsidyRate">
                  <Form.Label>Subsidy Rate</Form.Label>
                  <Form.Control
                    type="text"
                    value={subsidyRate}
                    onChange={(e) => setSubsidyRate(e.target.value)}
                  />
                </Form.Group>
              </div>

              <div className="col-sm">
                <Form.Group className="mb-3" controlId="alumni">
                  <Form.Label>Alumni</Form.Label>
                  <Form.Control
                    type="text"
                    value={alumni}
                    onChange={(e) => setAlumni(e.target.value)}
                  />
                </Form.Group>
              </div>

              <div className="col-sm">
                <Form.Group className="mb-3" controlId="wtChairman">
                  <Form.Label>WT Chairman</Form.Label>
                  <Form.Control
                    type="text"
                    value={wtChairman}
                    onChange={(e) => setWtChairman(e.target.value)}
                  />
                </Form.Group>
              </div>

              <div className="col-sm">
                <Form.Group className="mb-3" controlId="products">
                  <Form.Label>Product/s</Form.Label>
                  <Form.Control
                    type="text"
                    value={products}
                    onChange={(e) => setProducts(e.target.value)}
                  />
                </Form.Group>
              </div>

              <div className="col-sm">
                <Form.Group className="mb-3" controlId="trainingPlan">
                  <Form.Label>Training Plan</Form.Label>
                  <Form.Control
                    type="text"
                    value={trainingPlan}
                    onChange={(e) => setTraningPlan(e.target.value)}
                  />
                </Form.Group>
              </div>

              <div className="col-sm">
                <Form.Group className="mb-3" controlId="trainingAssignment">
                  <Form.Label>Training Assignment</Form.Label>
                  <Form.Control
                    type="text"
                    value={trainingAssignment}
                    onChange={(e) => setTrainingAssignment(e.target.value)}
                  />
                </Form.Group>
              </div>

              <div className="col-sm">
                <Form.Group className="mb-3" controlId="collectionAddress">
                  <Form.Label>Collection Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={collectionAddress}
                    onChange={(e) => setCollectionAddress(e.target.value)}
                  />
                </Form.Group>
              </div>

              <div className="col-sm">
                <Form.Group className="mb-3" controlId="collectionSchedule">
                  <Form.Label>Collection Schedule</Form.Label>
                  <Form.Control
                    type="text"
                    value={collectionSchedule}
                    onChange={(e) => setCollectionSchedule(e.target.value)}
                  />
                </Form.Group>
              </div>

              <div className="col-sm">
                <Form.Group className="mb-3" controlId="collectionRemarks">
                  <Form.Label>Collection Remarks</Form.Label>
                  <Form.Control
                    type="text"
                    value={collectionRemarks}
                    onChange={(e) => setCollectionRemarks(e.target.value)}
                  />
                </Form.Group>
              </div>

              <div className="col-sm">
                <Form.Group className="mb-3" controlId="others">
                  <Form.Label>Others</Form.Label>
                  <Form.Control
                    type="text"
                    value={others}
                    onChange={(e) => setOthers(e.target.value)}
                  />
                </Form.Group>
              </div>

              <div className="col-sm">
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
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
