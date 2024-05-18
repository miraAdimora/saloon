import React from "react";
import { useState } from 'react';
import PropTypes from "prop-types";
import { Card, Button, Col, Badge, Stack } from "react-bootstrap";
import { FaHeart, FaTrash } from "react-icons/fa";
import { TiDelete } from "react-icons/ti"
import Modal from 'react-bootstrap/Modal';
import { Principal } from "@dfinity/principal";
import InsertServices from "./InsertServiceToSaloon";


const Saloon = ({ saloon, deleteSaloonId }) => {

  const [show, setShow] = useState(false);
  const [serviceshow, setServiceShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleServiceClose = () => setServiceShow(false);
  const handleShow = () => setShow(true);
  const handleServiceShow = () => setServiceShow(true);

  const { id, name, location, imageURL,services, owner } =
  saloon;


  const triggerDelete = () => {
    deleteSaloonId(id);
  };
  
  // const triggerLike = () => {
  //   likeShoes(id);
  // };

  return (
    <Col key={id}>
      <Card className=" h-100">
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <TiDelete onClick={triggerDelete} style={{color: "red", cursor:"pointer",fontSize:"25px"}}/>
          </Stack>
        </Card.Header>
        <Card.Body className="d-flex  flex-column text-center">
        <div className=" ratio ratio-4x3">
          <img src={imageURL} alt={name} style={{ objectFit: "cover" }} />
        </div>
        <Card.Title>{name}</Card.Title>
          <div>
             <div className="text-uppercase fw-bold text-secondary">Location: </div>
             <span>{location} </span> 
          </div>
          <Card.Text className="text-secondary">
            <span>{Principal.from(owner).toText()}</span>
          </Card.Text>
          <InsertServices saloonId={id} />
          <div variant="success" style={{ color:"blue", cursor:"pointer"}}  onClick={handleServiceShow}>
        <span>View services</span>
        </div>
          <Modal show={serviceshow} onHide={handleServiceClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Services</Modal.Title>
            </Modal.Header>
                <Modal.Body>
                <ul>
            {services.map((service) => (
              <li key={service.id} style={{marginBottom: "2px"}}>
                {service.name} {"   "}
                {service.description}
              </li>
            ))}
          </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleServiceClose}>
                        Close
                    </Button>
                   
                </Modal.Footer>
        </Modal>
        </Card.Body>
      </Card>
    </Col>
  );
};

Saloon.propTypes = {
  saloon: PropTypes.instanceOf(Object).isRequired,
};

export default Saloon;