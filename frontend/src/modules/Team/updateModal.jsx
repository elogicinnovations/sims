import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert"; // Import SweetAlert 1
import BASE_URL from "../../assets/global/url";

const UpdateModal = ({ show, handleClose, reloadTable, teamData }) => {
  const [teamId, setTeamId] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (teamData) {
      setTeamId(teamData.id);
      setTeamName(teamData.teamName);
      setTeamCode(teamData.teamCode);
      setStatus(teamData.status === "Active");
    }
  }, [teamData]);

  const updateTeam = async (e) => {
    e.preventDefault();

    // Basic form validations
    if (!teamName.trim() || !teamCode.trim()) {
      swal(
        "Validation Error",
        "Both Team Name and Team Code are required.",
        "warning"
      );
      return;
    }

    const updatedTeam = {
      teamId,
      teamName,
      teamCode,
      status: status ? "Active" : "Inactive",
    };

    try {
      const response = await axios.put(
        `${BASE_URL}/team/updateTeam/${updatedTeam.teamId}`, // Update this to your actual endpoint
        updatedTeam
      );

      if (response.status === 200) {
        swal("Success", "Team updated successfully.", "success");

        // Reload the table and clear inputs
        reloadTable();
        handleClose(); // Close the modal
      }
    } catch (err) {
      console.error("Update error:", err);
      swal("Error", "An error occurred while updating the team.", "error");
      console.error("Error updating team", err);
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
        <Form noValidate onSubmit={updateTeam}>
          <Modal.Header className="border-0">
            <Modal.Title>
              <h2>Update Team {teamId}</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="teamName">
                  <Form.Label>Team Name</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="teamCode">
                  <Form.Label>Team Code</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={teamCode}
                    onChange={(e) => setTeamCode(e.target.value)}
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
