import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddService = ({ save }) => {

    const [name , setName] = useState("");
    const [description, setDescription] = useState("");

    const isFormFilled = () => name && description

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  return (
    <>
        <Button variant="primary" onClick={handleShow}>
            Add Service
        </Button>
    
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Add Service</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicName">
                <FloatingLabel controlId="floatingInput" label="name">
                    <Form.Control
                    type="text"
                    placeholder="Enter service name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                </FloatingLabel>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicUnit">
                <FloatingLabel controlId="floatingInput" label="description">
                    <Form.Control
                    type="text"
                    placeholder="Enter Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    />
                </FloatingLabel>
                </Form.Group>
            </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            {isFormFilled() && (
                <Button
                variant="primary"
                onClick={() => {
                    save({ name, description });
                    handleClose();
                }}
                >
                Save
                </Button>
            )}
            </Modal.Footer>
        </Modal>
        
    </>
  )
}

export default AddService