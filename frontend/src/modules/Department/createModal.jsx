import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

const createModal = ({ show, handleClose }) => {
  return (
    <div>
      <Modal
        backdrop={false}
        show={show}
        onHide={handleClose}
        animation={false}
      >
        <Form>
          <Modal.Header className="border-0">
            <Modal.Title>
              <h2>Add New Department</h2>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="basedCurrency">
                  <Form.Label>Department Name</Form.Label>
                  <Form.Control type="text" required />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-sm">
                <Form.Group className="mb-3" controlId="basedCurrency">
                  <Form.Label>Department Code</Form.Label>
                  <Form.Control type="text" required />
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
                        <input type="checkbox" id="status" />
                        <span className="slider round"></span>
                      </label>
                      <label htmlFor="status">Toggle on to Active</label>
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

export default createModal;
