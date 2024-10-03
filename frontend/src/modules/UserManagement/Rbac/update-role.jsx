import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import swal from "sweetalert";
import _Sidebar from "../../Sidebar/sidebar";
import "../../styles/usermanagement.css";
// import "../styles/pos_react.css";
import { customStyles } from "../../styles/table-style";
import { useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import axios from "axios";
import BASE_URL from "../../../assets/global/url";
import { jwtDecode } from "jwt-decode";
const UpdateUserRole = () => {
  const [userId, setuserId] = useState("");

  const decodeToken = () => {
    var token = localStorage.getItem("accessToken");
    if (typeof token === "string") {
      var decoded = jwtDecode(token);
      setuserId(decoded.id);
    }
  };
  useEffect(() => {
    decodeToken();
  }, []);

  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState();
  const [validated, setValidated] = useState(false);
  const [desc, setDesc] = useState();
  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios
          .get(BASE_URL + `/userRole/fetchuserroleEDIT`, {
            params: {
              id,
            },
          })
          .then((res) => {
            setName(res.data.col_rolename);
            setDesc(res.data.col_desc);
            const authorizations = res.data.col_authorization
              .split(", ")
              .map((auth, index) => ({
                id: `${auth}`,
              }));

            setCheckedItems(authorizations);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the fetchData function when the component mounts
  }, [id]); // Include id in the dependency array to re-run the effect when id changes

  const selectAll = () => {
    const checkboxIds = [
      "User-View",
      "UserRole-View",
      "Dashboard-View",
      "Department-Add",
      "Department-Edit",
      "Department-Delete",
      "Department-IE",
      "Section-View",
      "Section-Add",
      "Course-View",
      "Course-Add",
      "Subject-View",
      "Subject-Add",
      "Team-View",
      "Team-Add",
      "Team-Edit",
      "Team-Delete",
    ];

    const updatedCheckboxes = checkboxIds.map((value) => ({
      id: value,
    }));

    setCheckedItems(updatedCheckboxes);

    console.log(updatedCheckboxes);
  };

  const deselectAll = () => {
    setCheckedItems([]);
  };

  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    let updatedItems = [...checkedItems]; // Clone the existing checkedItems array

    if (checked) {
      // Add the checked item
      updatedItems.push({ id });
    } else {
      // Remove the unchecked item
      updatedItems = updatedItems.filter((item) => item.id !== id);
    }

    setCheckedItems(updatedItems);
  };

  const update_rbac = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      swal({
        icon: "error",
        title: "Fields are required",
        text: "Please fill the red text fields",
      });
    } else {
      if (checkedItems && checkedItems.length === 0) {
        swal({
          icon: "error",
          title: "Checkbox field required",
          text: "Please select at least one checkbox",
        });
        return;
      }
      swal({
        title: `Are you sure want to update this new role?`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (approve) => {
        if (approve) {
          axios
            .post(`${BASE_URL}/userRole/updateRbac`, null, {
              params: {
                name,
                desc,
                checkedItems: JSON.stringify(checkedItems || []),
                id,
                userId,
              },
            })
            .then((res) => {
              // console.log(res);
              if (res.status === 200) {
                swal({
                  title: "Success",
                  text: "Role successfully updated",
                  icon: "success",
                  button: "OK",
                }).then(() => {
                  navigate("/user-role");
                });
              } else if (res.status === 202) {
                swal({
                  title: "Rolename already Exist",
                  text: "Please input another name",
                  icon: "error",
                  button: "OK",
                });
              } else {
                swal({
                  icon: "error",
                  title: "Something went wrong",
                  text: "Please contact our support",
                });
              }
            });
        }
      });
    }
    setValidated(true); //for validations
  };

  return (
    <>
      <div>
        <div className="create-role-container">
          <div className="title-container pt-5 stud-man-container">
            <h2>Create Role Access</h2>
          </div>
          <Form noValidate validated={validated} onSubmit={update_rbac}>
            <div className="main-role-container">
              <div className="input-role-container">
                <p>Name</p>
                <Form.Control
                  placeholder="Enter Role Name"
                  className="form-control mb-0"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="input-role-container">
                <p>Description</p>
                <Form.Control
                  placeholder="Description"
                  className="form-control mb-0"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>
            </div>

            <div className="btn-role-container">
              <button type="button" onClick={selectAll}>
                Select All
              </button>
              <button type="button" onClick={deselectAll}>
                Unselect All
              </button>
            </div>

            <table className="role-table-lists">
              <thead>
                <tr>
                  <th>Module</th>
                  <th>View</th>
                  <th>Add</th>
                  <th>Edit</th>
                  <th>Delete</th>
                  <th>Import/Export</th>
                </tr>
              </thead>
              <tbody>
                {/* Dashboard */}
                <tr>
                  <td className="sub-module-title">Dashboard</td>
                  <td>
                    <input
                      id="Dashboard-View"
                      type="checkbox"
                      onChange={handleCheckboxChange}
                      checked={checkedItems.some(
                        (item) => item.id === "Dashboard-View"
                      )}
                    />
                  </td>
                </tr>

                {/* Department */}
                <tr>
                  <td className="sub-module-title">Department</td>
                  <td>
                    <input
                      id="Department-View"
                      type="checkbox"
                      onChange={handleCheckboxChange}
                      checked={checkedItems.some(
                        (item) => item.id === "Department-View"
                      )}
                    />
                  </td>
                  <td>
                    <input
                      id="Department-Add"
                      type="checkbox"
                      disabled={
                        !checkedItems.some(
                          (item) => item.id === "Department-View"
                        )
                      }
                      onChange={handleCheckboxChange}
                      checked={checkedItems.some(
                        (item) => item.id === "Department-Add"
                      )}
                    />
                  </td>
                  <td>
                    <input
                      id="Department-Edit"
                      type="checkbox"
                      disabled={
                        !checkedItems.some(
                          (item) => item.id === "Department-View"
                        )
                      }
                      onChange={handleCheckboxChange}
                      checked={checkedItems.some(
                        (item) => item.id === "Department-Edit"
                      )}
                    />
                  </td>
                  <td>
                    <input
                      id="Department-Delete"
                      type="checkbox"
                      disabled={
                        !checkedItems.some(
                          (item) => item.id === "Department-View"
                        )
                      }
                      onChange={handleCheckboxChange}
                      checked={checkedItems.some(
                        (item) => item.id === "Department-Delete"
                      )}
                    />
                  </td>
                  <td>
                    <input
                      id="Department-IE"
                      type="checkbox"
                      disabled={
                        !checkedItems.some(
                          (item) => item.id === "Department-View"
                        )
                      }
                      onChange={handleCheckboxChange}
                      checked={checkedItems.some(
                        (item) => item.id === "Department-IE"
                      )}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="btn-role-save">
              <button
                type="button"
                className="role-back"
                onClick={() => navigate("/user-role")}
              >
                Back
              </button>
              <button type="submit" className="role-save">
                Save
              </button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default UpdateUserRole;
