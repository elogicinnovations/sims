import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"; // Import SweetAlert 1
import BASE_URL from "../../assets/global/url";

const UpdateModal = ({ show, handleClose, reloadTable, groupData }) => {
  const [groupId, setGroupId] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (groupData) {
      setGroupId(groupData.id);
      setGroupName(groupData.groupName);
      setGroupCode(groupData.groupCode);
      setStatus(groupData.status === "Active");
    }
  }, [groupData]);

  const updateGroup = async (e) => {
    e.preventDefault();

    // Basic form validations
    if (!groupName.trim() || !groupCode.trim()) {
      swal(
        "Validation Error",
        "Both Group Name and Group Code are required.",
        "warning"
      );
      return;
    }

    const updatedGroup = {
      groupId,
      groupName,
      groupCode,
      status: status ? "Active" : "Inactive",
    };

    try {
      const response = await axios.put(
        `${BASE_URL}/group/updateGroup/${updatedGroup.groupId}`, // Update this to your actual endpoint
        updatedGroup
      );

      if (response.status === 200) {
        swal("Success", "Group updated successfully.", "success");

        // Reload the table and clear inputs
        reloadTable();
        handleClose(); // Close the modal
      }
    } catch (err) {
      console.error("Update error:", err);
      swal("Error", "An error occurred while updating the group.", "error");
      console.error("Error updating group", err);
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
        <Form noValidate onSubmit={updateGroup}>
          <Modal.Header className="border-0">
            <Modal.Title>
              <h2>Update Group {groupId}</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="groupName">
                  <Form.Label>Group Name</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="groupCode">
                  <Form.Label>Group Code</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={groupCode}
                    onChange={(e) => setGroupCode(e.target.value)}
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
