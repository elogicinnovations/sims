import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"; // Import SweetAlert 1
import BASE_URL from "../../assets/global/url";

const UpdateModal = ({ show, handleClose, reloadTable, courseData }) => {
  const [courseId, setCourseId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (courseData) {
      setCourseId(courseData.id);
      setCourseName(courseData.courseName);
      setCourseCode(courseData.courseCode);
      setStatus(courseData.status === "Active");
    }
  }, [courseData]);

  const updateCourse = async (e) => {
    e.preventDefault();

    // Basic form validations
    if (!courseName.trim() || !courseCode.trim()) {
      swal(
        "Validation Error",
        "Both Course Name and Course Code are required.",
        "warning"
      );
      return;
    }

    const updatedCourse = {
      courseId,
      courseName,
      courseCode,
      status: status ? "Active" : "Inactive",
    };

    try {
      const response = await axios.put(
        `${BASE_URL}/course/updateCourse/${updatedCourse.courseId}`, // Update this to your actual endpoint
        updatedCourse
      );

      if (response.status === 200) {
        swal("Success", "Course updated successfully.", "success");

        // Reload the table and clear inputs
        reloadTable();
        handleClose(); // Close the modal
      }
    } catch (err) {
      console.error("Update error:", err);
      swal("Error", "An error occurred while updating the course.", "error");
      console.error("Error updating course", err);
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
        <Form noValidate onSubmit={updateCourse}>
          <Modal.Header className="border-0">
            <Modal.Title>
              <h2>Update Course {courseId}</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="courseName">
                  <Form.Label>Course Name</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="courseCode">
                  <Form.Label>Course Code</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
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
