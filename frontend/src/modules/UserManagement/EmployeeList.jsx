import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import BASE_URL from "../../assets/global/url";
import NoAccess from "../../assets/image/NoAccess.png";
import { Modal, Button, Form, Alert, Offcanvas } from "react-bootstrap";
import swal from "sweetalert";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import _Sidebar from "../Sidebar/_Sidebar";
import "../styles/usermanagement.css";
import noData from "../../assets/icon/no-data.png";
import DataTable from "react-data-table-component";
// import "../styles/pos_react.css";
import { customStyles } from "../styles/table-style";
import { Plus, ArrowsClockwise } from "@phosphor-icons/react";
import { jwtDecode } from "jwt-decode";
import { FourSquare } from "react-loading-indicators";
import { useForm, useFieldArray, useWatch } from "react-hook-form";

function EmployeeList({ authrztn }) {
  const [validated, setValidated] = useState(false);
  const [rfidError, setRfidError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState([]);
  const [fetchMasterlist, setFetchMasterlist] = useState([]);
  const [fetchSupervisorData, setFetchSupervisorData] = useState([]);
  const [userId, setuserId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("");
  const [showChangeStatusButton, setShowChangeStatusButton] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showUpdateAccount, setShowUpdateAccount] = useState(false);
  const [containerClass, setContainerClass] = useState("users-container");
  const [showChangeStatusModal, setShowChangeStatusModal] = useState(false);
  const handleCloseStatusModal = () => setShowChangeStatusModal(false);
  const handleShowChangeStatusModal = () => {
    setShowChangeStatusModal(true);
  };

  const { register, setValue, getValues, watch, reset } = useForm({
    defaultValues: {
      userType: "",
      userRole: "",
      userFullname: "",
      userEmail: "",
      userAddress: "",
      userContactNumber: "",
      username: "",
      userPIN: ["", "", "", ""],
      userPassword: "",
      userCPassword: "",
      userSupervisor: "",
      userRFID: "",
    },
  });

  const handleInput = (e) => {
    const value = e.target.value;

    const filteredValue = value.replace(/[^0-9+]/g, "");

    if (filteredValue.length > 13) {
      e.target.value = filteredValue.slice(0, 13);
    } else {
      e.target.value = filteredValue;
    }
  };

  const userType = watch("userType");
  const userPassword = watch("userPassword");
  const userCPassword = watch("userCPassword");

  const [validation, setValidation] = useState({
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    isLongEnough: false,
    passwordsMatch: false,
  });

  useEffect(() => {
    setValidation({
      hasUpperCase: /[A-Z]/.test(userPassword),
      hasLowerCase: /[a-z]/.test(userPassword),
      hasNumber: /[0-9]/.test(userPassword),
      isLongEnough: userPassword.length >= 8,
      passwordsMatch:
        userPassword && userCPassword ? userPassword === userCPassword : false,
    });
  }, [userPassword, userCPassword]);

  const handlePINChange = (e, index) => {
    const value = e.target.value;

    if (value.length > 1 || isNaN(value)) {
      return;
    }

    setValue(`userPIN[${index}]`, value);

    if (value !== "" && index < 3) {
      const nextField = document.querySelector(
        `input[name="userPIN[${index + 1}]"]`
      );
      if (nextField) {
        nextField.focus();
      }
    }
  };

  //function for clicking and updating button
  const handleAddAccount = () => {
    setShowAddAccount(!showAddAccount);
    setShowUpdateAccount(false);
  };

  const handleRowClick = async (row) => {
    if (authrztn.includes("User-Edit")) {
      try {
        setSelectedUserId(row.col_id);
        setShowUpdateAccount(!showUpdateAccount);
        setShowAddAccount(false);

        // Fetch the user data for the selected row
        const response = await axios.get(
          `${BASE_URL}/masterList/getUser/${row.col_id}`
        );
        const userData = response.data;
        console.log(userData);
        // Set form values with the fetched user data
        setValue("userType", userData.user_type);
        setValue("userRole", userData.userRole.col_id);
        setValue("userFullname", userData.col_name);
        setValue("userEmail", userData.col_email);
        setValue("userAddress", userData.col_address);
        setValue("userContactNumber", userData.col_phone);
        setValue("username", userData.col_username);
        setValue(
          "userPIN",
          userData.user_pin
            ? userData.user_pin.split("").map((digit) => digit || "")
            : ["", "", "", ""]
        ); // Handle PIN
        setValue("userPassword", userData.col_Pass);
        setValue("userCPassword", userData.col_Pass);
        setValue(
          "userSupervisor",
          userData.supervisor ? userData.supervisor.col_id : ""
        );
        setValue("userRFID", userData.rfid);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  useEffect(() => {
    if (showAddAccount || showUpdateAccount) {
      setContainerClass("users-div d-flex flex-row");
    } else {
      setContainerClass("users-div");
    }
  }, [showAddAccount, showUpdateAccount]);
  //function for clicking and updating button

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const decodeToken = () => {
    var token = localStorage.getItem("accessToken");
    if (typeof token === "string") {
      var decoded = jwtDecode(token);
      setuserId(decoded.id);
    }
  };

  const fetchRole = () => {
    axios
      .get(BASE_URL + "/userRole/fetchuserrole")
      .then((res) => {
        console.log(res.data);
        setRole(res.data);
      })
      .catch((err) => console.log(err));
  };

  const fetchMasterlistTable = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/masterList/masterTable`);
      setFetchMasterlist(res.data);
      setIsLoading(false);
    } catch (error) {
      // console.error(error);
      setIsLoading(true);
    }
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const filteredData = fetchMasterlist.filter((row) => {
    if (statusFilter === "All Status") {
      return true; // Show all data
    }
    if (statusFilter === "" || statusFilter === "Non-Archive") {
      return row.col_status !== "Archive"; // Default behavior: show non-Archive
    }
    return row.col_status === statusFilter; // Filter by specific status
  });

  const fetchSupervisor = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/masterList/supervisor`);
      setFetchSupervisorData(res.data);
    } catch (error) {
      // console.error(error);
    }
  };

  const handleUpdateForm = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      swal({
        icon: "error",
        title: "Required Fields",
        text: "Please fill in all required fields.",
      });
    } else {
      // Gather the form data
      const data = {
        userType: getValues("userType"),
        userRole: getValues("userRole"),
        userFullname: getValues("userFullname"),
        userEmail: getValues("userEmail"),
        userAddress: getValues("userAddress"),
        userContactNumber: getValues("userContactNumber"),
        username: getValues("username"),
        userPIN: getValues("userPIN").join(""),
        userPassword: getValues("userPassword"),
        userCPassword: getValues("userCPassword"),
        userSupervisor: getValues("userSupervisor"),
        usermasterId: selectedUserId,
        userRFID: getValues("userRFID"),
        userId: userId,
      };
      axios
        .put(`${BASE_URL}/masterList/updateMaster`, data)
        .then((response) => {
          if (response.status === 200) {
            swal({
              title: "Account Information Updated!",
              text: "The account has been updated successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              fetchMasterlistTable();
              setValidated(false);
              setShowUpdateAccount(false);
              fetchSupervisor();
            });
          } else if (response.status === 201) {
            swal({
              title: "Email already taken",
              text: "Please input another email.",
              icon: "error",
            });
            setEmailError(true);
          } else if (response.status === 203) {
            swal({
              title: "RFID alredy taken",
              text: "Please input another rfid number",
              icon: "error",
              dangerMode: true,
            });
            setRfidError(true);
          } else if (response.status === 204) {
            swal({
              title: "RFID and Email already taken",
              text: "Please input another rfid number and email",
              icon: "error",
              dangerMode: true,
            });
            setRfidError(true);
            setEmailError(true);
          } else if (response.status === 202) {
            swal({
              title: "Oppss!",
              text: "Invalid email format",
              icon: "error",
              dangerMode: true,
            });
          }
        });
    }
    setValidated(true);
  };
  const validateEmail = (email) => {
    // Simple regex for basic email validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).trim().toLowerCase());
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = getValues();
    const { userEmail } = formData;

    // Validate email
    if (userEmail && !validateEmail(userEmail)) {
      swal({
        icon: "error",
        title: "Invalid Email Format",
        text: "Please enter a valid email address",
      });
      return;
    }
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      swal({
        icon: "error",
        title: "Required Fields",
        text: "Please fill in all required fields.",
      });
    } else {
      const formData = getValues();
      formData.userPIN = formData.userPIN.join("");
      formData.userId = userId;
      axios
        .post(BASE_URL + "/masterList/createMaster", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            swal({
              title: "New Account Added Successfully!",
              text: "The new account has been added successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              fetchMasterlistTable();
              setValidated(false);
              setShowAddAccount(false);
              fetchSupervisor();
              reset();
            });
          } else if (response.status === 201) {
            swal({
              title: "Email already taken",
              text: "Please input another email.",
              icon: "error",
            });
          } else if (response.status === 203) {
            swal({
              title: "RFID alredy taken",
              text: "Please input another rfid number",
              icon: "error",
              dangerMode: true,
            });
          } else if (response.status === 204) {
            swal({
              title: "RFID and Email already taken",
              text: "Please input another rfid number and email",
              icon: "error",
              dangerMode: true,
            });
          } else if (response.status === 202) {
            swal({
              title: "Oppss!",
              text: "Invalid email format",
              icon: "error",
              dangerMode: true,
            });
          }
        });
    }
    setValidated(true);
  };

  const handleCheckboxChange = (masterlistIds) => {
    const updatedCheckboxes = [...selectedCheckboxes];

    if (updatedCheckboxes.includes(masterlistIds)) {
      updatedCheckboxes.splice(updatedCheckboxes.indexOf(masterlistIds), 1);
    } else {
      updatedCheckboxes.push(masterlistIds);
    }

    setSelectedCheckboxes(updatedCheckboxes);
    setShowChangeStatusButton(updatedCheckboxes.length > 0);
  };

  const handleSelectAllChange = () => {
    const masterlistIds = fetchMasterlist.map((data) => data.col_id);

    if (masterlistIds.length === 0) {
      return;
    }

    if (selectedCheckboxes.length === masterlistIds.length) {
      setSelectedCheckboxes([]);
      setShowChangeStatusButton(false);
      setSelectAllChecked(false);
    } else {
      setSelectedCheckboxes(masterlistIds);
      setShowChangeStatusButton(true);
      setSelectAllChecked(true);
    }
  };

  const columns = [
    {
      name: (
        <input
          type="checkbox"
          onChange={handleSelectAllChange}
          checked={selectAllChecked}
        />
      ),
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedCheckboxes.includes(row.col_id)}
          onChange={() => handleCheckboxChange(row.col_id)}
        />
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "NAME",
      selector: (row) => row.col_name,
      sortable: true,
    },
    {
      name: "CONTACT",
      selector: (row) => row.col_phone,
      sortable: true,
    },
    {
      name: "USER TYPE",
      selector: (row) => row.user_type,
      sortable: true,
    },
    {
      name: "STATUS",
      selector: (row) => {
        let backgroundColor;
        switch (row.col_status) {
          case "Active":
            backgroundColor = "green";
            break;
          case "Inactive":
            backgroundColor = "red";
            break;
          case "Archive":
            backgroundColor = "gray";
            break;
          default:
            backgroundColor = "transparent";
        }

        const textColor = "white";

        return (
          <span
            style={{
              backgroundColor,
              color: textColor,
              padding: "0.25rem 0.5rem",
              borderRadius: "4px",
            }}
          >
            {row.col_status}
          </span>
        );
      },
      sortable: true,
    },
  ];

  //update status
  const handleSave = () => {
    axios
      .put(BASE_URL + "/masterList/statusupdate", {
        masterlistIds: selectedCheckboxes,
        status: selectedStatus,
      })
      .then((res) => {
        if (res.status === 200) {
          swal({
            title: "User status Update!",
            text: "The user status has been updated successfully.",
            icon: "success",
            button: "OK",
          }).then(() => {
            handleCloseStatusModal();
            fetchMasterlistTable();
            setSelectAllChecked(false);
            setSelectedCheckboxes([]);
            setShowChangeStatusButton(false);
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleStatusChange = (event) => {
    if (event.target.value === "Archive") {
      if (authrztn.includes("User-Delete")) {
        setSelectedStatus(event.target.value);
      } else {
        swal({
          title: "Oppss!",
          text: "You don't have privilege to archive",
          icon: "error",
          button: "OK",
        });
      }
    } else {
      setSelectedStatus(event.target.value);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMasterlistTable();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchRole();
    decodeToken();

    fetchSupervisor();
  }, []);
  // Read NFCCC

  // const scan = useCallback(async () => {
  //   if ("NDEFReader" in window) {
  //     try {
  //       const ndef = new window.NDEFReader();
  //       await ndef.scan();

  //       console.log("Scan started successfully.");
  //       ndef.onreadingerror = () => {
  //         console.log("Cannot read data from the NFC tag. Try another one?");
  //       };

  //       ndef.onreading = (event) => {
  //         console.log("NDEF message read.");
  //         onReading(event);
  //         setActions({
  //           scan: "scanned",
  //           write: null,
  //         });
  //       };
  //     } catch (error) {
  //       console.log(`Error! Scan failed to start: ${error}.`);
  //     }
  //   }
  // }, []);

  // useEffect(() => {
  //   scan();
  // }, []);

  return (
    <>
      <div className={containerClass}>
        {isLoading ? (
          <div
            className="loading-container"
            style={{ margin: "0", marginLeft: "250px" }}
          >
            <FourSquare
              color="#6290FE"
              size="large"
              text="Loading Data..."
              textColor=""
            />
          </div>
        ) : authrztn.includes("User-View") ? (
          <div className="users-container">
            <div className="title-container pt-5 stud-man-container">
              <h2>Manage Store Account</h2>
            </div>
            <div className="btn-manage-container d-flex justify-content-end p-0">
              <div className="manage-user d-flex">
                <select
                  class="form-select m-0"
                  onChange={handleStatusFilterChange}
                >
                  <option value="" disabled>
                    Select Status
                  </option>
                  <option value="All Status">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Archive">Archive</option>
                </select>

                {showChangeStatusButton
                  ? authrztn.includes("User-Edit") && (
                      <button
                        className="btn btn-secondary"
                        onClick={handleShowChangeStatusModal}
                      >
                        <ArrowsClockwise size={32} color="#f2f2f2" /> Change
                        Status
                      </button>
                    )
                  : authrztn.includes("User-Add") && (
                      <button onClick={handleAddAccount}>
                        <Plus size={32} color="#f2f2f2" /> Add Account
                      </button>
                    )}
              </div>
            </div>
            <div className="mt-4">
              {fetchMasterlist.length == 0 ? (
                <>
                  <div className="no-data-table ">
                    <table>
                      <thead>
                        <th>NAME</th>
                        <th>CONTACT</th>
                        <th>USER TYPE</th>
                        <th>STATUS</th>
                      </thead>
                      <tbody className="r-no-data">
                        <div>
                          <img
                            src={noData}
                            alt="No Data"
                            className="no-data-icon"
                          />
                          <h2 className="no-data-label">No Data Found</h2>
                        </div>
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <>
                  <div className="c-data-table">
                    <DataTable
                      columns={columns}
                      data={filteredData}
                      pagination
                      paginationRowsPerPageOptions={[5, 10, 25]}
                      highlightOnHover
                      onRowClicked={handleRowClick}
                      customStyles={customStyles}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <img src={NoAccess} alt="NoAccess" className="no-access-img" />
            <h3>You don't have access to this function.</h3>
          </div>
        )}
        {/* </div> */}
        {showAddAccount && (
          <div className="add-account-container pt-5">
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
              <div className="add-account-content">
                <div className="add-account-title">
                  <h1>Add Account</h1>
                  <hr />
                </div>
                <div className="add-account-body">
                  <div className="row">
                    <div class="col">
                      <Form.Group>
                        <Form.Label>User Type</Form.Label>
                        <Form.Select
                          style={{ height: "40px" }}
                          className="user-modal-form"
                          required
                          {...register("userType")}
                        >
                          <option value="" disabled>
                            Select User Type
                          </option>
                          <option value="Admin">Admin</option>
                          <option value="Supervisor">Supervisor</option>
                          <option value="Cashier">Cashier</option>
                          <option value="Kiosk">Kiosk</option>
                        </Form.Select>
                      </Form.Group>
                    </div>
                    <div className="col-sm">
                      <Form.Group>
                        <Form.Label>User Access</Form.Label>
                        <Form.Select
                          style={{ height: "40px" }}
                          className="user-modal-form"
                          defaultValue=""
                          disabled={userType === "Kiosk"}
                          required={userType !== "Kiosk"}
                          {...register("userRole")}
                        >
                          <option value="" disabled>
                            Select User Access
                          </option>
                          {role.map((data) => (
                            <option
                              key={data.col_id}
                              name={data.col_rolename}
                              value={data.col_id}
                            >
                              {data.col_rolename}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm">
                      <Form.Group>
                        <Form.Label>RFID Number</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Rfid Number"
                          className={`user-modal-form ${
                            rfidError ? "error-class" : ""
                          }`}
                          required={userType !== "Kiosk"}
                          {...register("userRFID")}
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <Form.Group>
                        <Form.Label>Fullname</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Name"
                          className="user-modal-form"
                          required={userType !== "Kiosk"}
                          {...register("userFullname")}
                        />
                      </Form.Group>
                    </div>
                    <div class="col">
                      <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Email"
                          className={`user-modal-form ${
                            emailError ? "error-class" : ""
                          }`}
                          required
                          {...register("userEmail")}
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <Form.Group>
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Address"
                          className="user-modal-form"
                          required={userType !== "Kiosk"}
                          {...register("userAddress")}
                        />
                      </Form.Group>
                    </div>
                    <div class="col">
                      <Form.Group>
                        <Form.Label>Contact Number</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Contact"
                          className="user-modal-form"
                          name="cnumber"
                          required={userType !== "Kiosk"}
                          {...register("userContactNumber")}
                          onInput={handleInput}
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm">
                      <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Username"
                          className="user-modal-form"
                          required={userType !== "Kiosk"}
                          {...register("username")}
                        />
                      </Form.Group>
                    </div>
                    {userType === "Cashier" && (
                      <div class="col-sm">
                        <Form.Group>
                          <Form.Label>Supervisor</Form.Label>
                          <Form.Select
                            style={{ height: "40px" }}
                            className="user-modal-form"
                            defaultValue=""
                            required={userType === "Cashier"}
                            {...register("userSupervisor")}
                          >
                            <option value="" disabled>
                              Select Supervisor
                            </option>
                            {fetchSupervisorData.map((data) => (
                              <option
                                key={data.col_id}
                                value={data.col_id}
                                name={data.col_name}
                              >
                                {data.col_name}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </div>
                    )}
                  </div>
                  <div class="row">
                    <div class="col">
                      <Form.Label>User PIN</Form.Label>
                      <div class="d-flex flex-row">
                        {[0, 1, 2, 3].map((index) => (
                          <div className="col-sm" key={index}>
                            <Form.Control
                              type="text" // Use text type to apply maxLength and pattern
                              name={`userPIN[${index}]`}
                              style={{
                                fontSize: "16px",
                                textAlign: "center",
                                height: "60px",
                              }}
                              required={userType !== "Kiosk"}
                              maxLength={1} // Limit to 1 character
                              {...register(`userPIN[${index}]`)}
                              onChange={(e) => handlePINChange(e, index)}
                              pattern="\d*" // Only digits
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className="user-modal-form"
                          required
                          {...register("userPassword")}
                        />
                        <div className="show" style={{ top: "32px" }}>
                          {showPassword ? (
                            <EyeSlash
                              size={24}
                              color="#1a1a1a"
                              weight="light"
                              onClick={togglePasswordVisibility}
                            />
                          ) : (
                            <Eye
                              size={24}
                              color="#1a1a1a"
                              weight="light"
                              onClick={togglePasswordVisibility}
                            />
                          )}
                        </div>
                      </Form.Group>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <Form.Group>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          className="user-modal-form"
                          required
                          {...register("userCPassword")}
                        />
                        <div className="show" style={{ top: "32px" }}>
                          {showConfirmPassword ? (
                            <EyeSlash
                              size={24}
                              color="#1a1a1a"
                              weight="light"
                              onClick={toggleConfirmPasswordVisibility}
                            />
                          ) : (
                            <Eye
                              size={24}
                              color="#1a1a1a"
                              weight="light"
                              onClick={toggleConfirmPasswordVisibility}
                            />
                          )}
                        </div>
                      </Form.Group>
                      <div className="col-sm fs-5">
                        <div
                          style={{
                            color: validation.hasUpperCase ? "green" : "red",
                          }}
                        >
                          {validation.hasUpperCase ? "✔ " : "✘ "} At least one
                          uppercase letter
                        </div>
                        <div
                          style={{
                            color: validation.hasLowerCase ? "green" : "red",
                          }}
                        >
                          {validation.hasLowerCase ? "✔ " : "✘ "} At least one
                          lowercase letter
                        </div>
                        <div
                          style={{
                            color: validation.hasNumber ? "green" : "red",
                          }}
                        >
                          {validation.hasNumber ? "✔ " : "✘ "} At least one
                          number
                        </div>
                        <div
                          style={{
                            color: validation.isLongEnough ? "green" : "red",
                          }}
                        >
                          {validation.isLongEnough ? "✔ " : "✘ "} At least 8
                          characters long
                        </div>
                        <div
                          style={{
                            color: validation.passwordsMatch ? "green" : "red",
                          }}
                        >
                          {validation.passwordsMatch ? "✔ " : "✘ "} Passwords
                          match
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="add-account-footer d-flex flex-row">
                <Button variant="outline-primary" onClick={handleAddAccount}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={
                    !(
                      validation.hasUpperCase &&
                      validation.hasLowerCase &&
                      validation.hasNumber &&
                      validation.isLongEnough &&
                      validation.passwordsMatch
                    )
                  }
                >
                  Save
                </Button>
              </div>
            </Form>
          </div>
        )}

        {/* update user  */}
        {showUpdateAccount && (
          <div className="add-account-container pt-5">
            <Form noValidate validated={validated} onSubmit={handleUpdateForm}>
              <div className="add-account-content">
                <div className="add-account-title">
                  <h1>Update Account</h1>
                  <hr />
                </div>
                <div className="add-account-body">
                  <div className="row">
                    <div class="col">
                      <Form.Group>
                        <Form.Label>User Type</Form.Label>
                        <Form.Select
                          style={{ height: "40px" }}
                          className="user-modal-form"
                          required
                          {...register("userType")}
                        >
                          <option value="" disabled>
                            Select User Type
                          </option>
                          <option value="Admin">Admin</option>
                          <option value="Supervisor">Supervisor</option>
                          <option value="Cashier">Cashier</option>
                          <option value="Kiosk">Kiosk</option>
                        </Form.Select>
                      </Form.Group>
                    </div>
                    <div className="col-sm">
                      <Form.Group>
                        <Form.Label>User Access</Form.Label>
                        <Form.Select
                          style={{ height: "40px" }}
                          className="user-modal-form"
                          defaultValue=""
                          disabled={userType === "Kiosk"}
                          required={userType !== "Kiosk"}
                          {...register("userRole")}
                        >
                          <option value="" disabled>
                            Select User Access
                          </option>
                          {role.map((data) => (
                            <option
                              key={data.col_id}
                              name={data.col_rolename}
                              value={data.col_id}
                            >
                              {data.col_rolename}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm">
                      <Form.Group>
                        <Form.Label>RFID Number</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Rfid Number"
                          className="user-modal-form"
                          required
                          {...register("userRFID")}
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <Form.Group>
                        <Form.Label>Fullname</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Name"
                          className="user-modal-form"
                          required
                          {...register("userFullname")}
                        />
                      </Form.Group>
                    </div>
                    <div class="col">
                      <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Email"
                          className="user-modal-form"
                          required
                          {...register("userEmail")}
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <Form.Group>
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Address"
                          className="user-modal-form"
                          required
                          {...register("userAddress")}
                        />
                      </Form.Group>
                    </div>
                    <div class="col">
                      <Form.Group>
                        <Form.Label>Contact Number</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Contact"
                          className="user-modal-form"
                          name="cnumber"
                          required
                          {...register("userContactNumber")}
                          onInput={handleInput}
                        />
                      </Form.Group>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-sm">
                      <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Username"
                          className="user-modal-form"
                          required
                          {...register("username")}
                        />
                      </Form.Group>
                    </div>
                    {userType === "Cashier" && (
                      <div class="col-sm">
                        <Form.Group>
                          <Form.Label>Supervisor</Form.Label>
                          <Form.Select
                            style={{ height: "40px" }}
                            className="user-modal-form"
                            required={userType === "Cashier"}
                            {...register("userSupervisor")}
                          >
                            <option value="" disabled>
                              Select Supervisor
                            </option>
                            {fetchSupervisorData.map((data) => (
                              <option
                                key={data.col_id}
                                value={data.col_id}
                                name={data.col_name}
                              >
                                {data.col_name}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </div>
                    )}
                  </div>
                  <div class="row">
                    <div class="col">
                      <Form.Label>User PIN</Form.Label>
                      <div class="d-flex flex-row">
                        {[0, 1, 2, 3].map((index) => (
                          <div className="col-sm" key={index}>
                            <Form.Control
                              type="text" // Use text type to apply maxLength and pattern
                              name={`userPIN[${index}]`}
                              style={{
                                fontSize: "16px",
                                textAlign: "center",
                                height: "60px",
                              }}
                              required
                              maxLength={1} // Limit to 1 character
                              {...register(`userPIN[${index}]`)}
                              onChange={(e) => handlePINChange(e, index)}
                              pattern="\d*" // Only digits
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          className="user-modal-form"
                          required
                          {...register("userPassword")}
                        />
                        <div className="show" style={{ top: "32px" }}>
                          {showPassword ? (
                            <EyeSlash
                              size={24}
                              color="#1a1a1a"
                              weight="light"
                              onClick={togglePasswordVisibility}
                            />
                          ) : (
                            <Eye
                              size={24}
                              color="#1a1a1a"
                              weight="light"
                              onClick={togglePasswordVisibility}
                            />
                          )}
                        </div>
                      </Form.Group>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <Form.Group>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          className="user-modal-form"
                          required
                          {...register("userCPassword")}
                        />
                        <div className="show" style={{ top: "32px" }}>
                          {showConfirmPassword ? (
                            <EyeSlash
                              size={24}
                              color="#1a1a1a"
                              weight="light"
                              onClick={toggleConfirmPasswordVisibility}
                            />
                          ) : (
                            <Eye
                              size={24}
                              color="#1a1a1a"
                              weight="light"
                              onClick={toggleConfirmPasswordVisibility}
                            />
                          )}
                        </div>
                      </Form.Group>
                      <div className="col-sm fs-5">
                        <div
                          style={{
                            color: validation.hasUpperCase ? "green" : "red",
                          }}
                        >
                          {validation.hasUpperCase ? "✔ " : "✘ "} At least one
                          uppercase letter
                        </div>
                        <div
                          style={{
                            color: validation.hasLowerCase ? "green" : "red",
                          }}
                        >
                          {validation.hasLowerCase ? "✔ " : "✘ "} At least one
                          lowercase letter
                        </div>
                        <div
                          style={{
                            color: validation.hasNumber ? "green" : "red",
                          }}
                        >
                          {validation.hasNumber ? "✔ " : "✘ "} At least one
                          number
                        </div>
                        <div
                          style={{
                            color: validation.isLongEnough ? "green" : "red",
                          }}
                        >
                          {validation.isLongEnough ? "✔ " : "✘ "} At least 8
                          characters long
                        </div>
                        <div
                          style={{
                            color: validation.passwordsMatch ? "green" : "red",
                          }}
                        >
                          {validation.passwordsMatch ? "✔ " : "✘ "} Passwords
                          match
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="add-account-footer d-flex flex-row">
                <Button variant="outline-primary" onClick={handleRowClick}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={
                    !(
                      validation.hasUpperCase &&
                      validation.hasLowerCase &&
                      validation.hasNumber &&
                      validation.isLongEnough &&
                      validation.passwordsMatch
                    )
                  }
                >
                  Update
                </Button>
              </div>
            </Form>
          </div>
        )}
      </div>

      {/* change status modal */}
      <Modal
        size="md"
        show={showChangeStatusModal}
        onHide={handleCloseStatusModal}
        backdrop="static"
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "24px" }}>Change Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="exampleForm.ControlInput2">
            <Form.Label style={{ fontSize: "20px" }}>Status</Form.Label>
            <Form.Select
              style={{ height: "40px", fontSize: "15px" }}
              onChange={handleStatusChange}
              value={selectedStatus}
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Archive">Archive</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-warning"
            onClick={handleSave}
            disabled={selectedStatus === ""}
            style={{ fontSize: "20px" }}
          >
            Save
          </Button>
          <Button
            variant="outline-secondary"
            onClick={handleCloseStatusModal}
            style={{ fontSize: "20px" }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EmployeeList;
