import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"; // Import SweetAlert 1
import BASE_URL from "../../assets/global/url";
import { Image } from "@phosphor-icons/react";

const CreateModal = ({ show, handleClose, reloadTable }) => {
  const [employeeNo, setEmployeeNo] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [initial, setInitial] = useState("");
  const [designation, setDesignation] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(false);
  const [userName, setUserNamer] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const [nameError, setNameError] = useState(false);
  const [codeError, setCodeError] = useState(false);

  const [departmentMap, setDepartmentMap] = useState([]);
  const [userRoleMap, setUserRoleMap] = useState([]);

  const [staffImages, setStaffimages] = useState("");
  const fileInputRefs = useRef(null);

  const createStaff = async (e) => {
    e.preventDefault();

    // Basic form validations
    let hasError = false;

    if (!parseInt(employeeNo.trim())) {
      setEmployeeNo(true);
      hasError = true;
    } else {
      setEmployeeNo(false);
    }

    if (!firstName.trim()) {
      setFirstName(true);
      hasError = true;
    } else {
      setFirstName(false);
    }

    if (!middleName.trim()) {
      setMiddleName(true);
      hasError = true;
    } else {
      setMiddleName(false);
    }

    if (!lastName.trim()) {
      setLastName(true);
      hasError = true;
    } else {
      setLastName(false);
    }

    if (!initial.trim()) {
      setInitial(true);
      hasError = true;
    } else {
      setInitial(false);
    }

    if (!email.trim()) {
      setEmail(true);
      hasError = true;
    } else {
      setEmail(false);
    }

    if (hasError) {
      swal(
        "Validation Error",
        "Both Staff Name and Staff Code are required.",
        "warning"
      );
      return;
    }

    const newStaff = {
      employeeNo,
      firstName,
      lastName,
      middleName,
      initial,
      designation,
      contact,
      email,
      status: status ? "Active" : "Inactive",
      userName,
      password,
      department,
      userRole,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/staff/createStaff`,
        newStaff
      );

      if (response.status === 200) {
        swal("Success", "Staff created successfully.", "success");

        // Reload the table and clear inputs
        reloadTable();
        setEmployeeNo("");
        setFirstName("");
        setLastName("");
        setMiddleName("");
        setInitial("");
        setContact("");
        setEmail("");
        setDesignation("");
        setDepartment(null);
        setStatus(false);
        setUserNamer("");
        setPassword("");
        setUserRole("");
        handleClose(); // Close the modal
      } else if (response.status === 201) {
        swal("Duplicate Entry", "This staff already exists.", "info");
      }
    } catch (err) {
      swal("Error", "An error occurred while creating the staff.", "error");
      console.error("Error creating staff", err);
    }
  };

  useEffect(() => {
    axios
      .get(BASE_URL + "/department/getDepartment")
      .then((response) => {
        const mappedDepartments = response.data.map((dept) => ({
          value: dept.id,
          label: dept.department_name,
        }));
        setDepartmentMap(mappedDepartments);
      })
      .catch((error) => {
        console.error("Error fetching departments:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + "/userRole/fetchuserrole")
      .then((response) => {
        const mappedUserRoles = response.data.map((dept) => ({
          value: dept.col_id,
          label: dept.col_rolename,
        }));
        setUserRoleMap(mappedUserRoles);
      })
      .catch((error) => {
        console.error("Error fetching userroles:", error);
      });
  }, []);

  function selectImageFiles() {
    fileInputRefs.current.click();
  }

  const deletecategoryImage = () => {
    setStaffimages("");
  };

  const onFileSelects = (event) => {
    const selectedImages = event.target.files[0]; // Assuming only one file is selected
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB LIMIT

    if (
      selectedImages &&
      allowedTypes.includes(selectedImages.type) &&
      selectedImages.size <= maxSize
    ) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedImages);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        setStaffimages(base64String);
      };
    } else {
      swal({
        icon: "error",
        title: "File Selection Error",
        text: "Please select a valid image file (PNG, JPEG, JPG, or WEBP) with a maximum size of 5MB.",
      });
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
        <Form noValidate onSubmit={createStaff}>
          <Modal.Header className="border-0">
            <Modal.Title>
              <h2>Add New Staff</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="image-section">
              {staffImages.length === 0 ? (
                <div className="imagedisplaying">
                  <Image size={42} color="#a1a1a1" />
                </div>
              ) : (
                <div className="imagedisplaying">
                  <span className="deleteimages" onClick={deletecategoryImage}>
                    &times;
                  </span>
                  <img src={`data:image/png;base64,${staffImages}`} />
                </div>
              )}
            </div>
            <div className="uploading-section">
              <div className="upload-sec-button">
                <span
                  className="select"
                  role="button"
                  onClick={selectImageFiles}
                >
                  Upload
                </span>
                <input
                  type="file"
                  className="file"
                  name="file"
                  ref={fileInputRefs}
                  onChange={onFileSelects}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="employeeNo">
                  <Form.Label>Employee No.</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={employeeNo}
                    onChange={(e) => setEmployeeNo(e.target.value)}
                    className={nameError ? "is-invalid" : ""}
                  />
                  {nameError && (
                    <Form.Control.Feedback type="invalid">
                      Employee No. Name is required.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="firstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={codeError ? "is-invalid" : ""}
                  />
                  {codeError && (
                    <Form.Control.Feedback type="invalid">
                      First Name is required.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="lastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={codeError ? "is-invalid" : ""}
                  />
                  {codeError && (
                    <Form.Control.Feedback type="invalid">
                      Last Name is required.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="middleName">
                  <Form.Label>Middle Name</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    className={codeError ? "is-invalid" : ""}
                  />
                  {codeError && (
                    <Form.Control.Feedback type="invalid">
                      Middle Name is required.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="initial">
                  <Form.Label>Initial</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={initial}
                    onChange={(e) => setInitial(e.target.value)}
                    className={codeError ? "is-invalid" : ""}
                  />
                  {codeError && (
                    <Form.Control.Feedback type="invalid">
                      Initial is required.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="contact">
                  <Form.Label>Contact No.</Form.Label>
                  <Form.Control
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className={codeError ? "is-invalid" : ""}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={codeError ? "is-invalid" : ""}
                  />
                  {codeError && (
                    <Form.Control.Feedback type="invalid">
                      Email Address is required.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="designation">
                  <Form.Label>Designation</Form.Label>
                  <Form.Control
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className={codeError ? "is-invalid" : ""}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="department">
                  <Form.Label>Department</Form.Label>
                  <Form.Select
                    onChange={(e) => setDepartment(e.target.value)}
                    value={department}
                    required
                  >
                    <option value="">Select Department</option>
                    {departmentMap.map((option) => (
                      <option value={option.value}>{option.label}</option>
                    ))}
                  </Form.Select>
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
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserNamer(e.target.value)}
                    className={codeError ? "is-invalid" : ""}
                  />
                  {codeError && (
                    <Form.Control.Feedback type="invalid">
                      Username is required.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={codeError ? "is-invalid" : ""}
                  />
                  {codeError && (
                    <Form.Control.Feedback type="invalid">
                      Password is required.
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="userRole">
                  <Form.Label>User Access Privileges</Form.Label>
                  <Form.Select
                    onChange={(e) => setUserRole(e.target.value)}
                    value={userRole}
                    required
                  >
                    <option value="">Select User Access Role</option>
                    {userRoleMap.map((option) => (
                      <option value={option.value}>{option.label}</option>
                    ))}
                  </Form.Select>
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
