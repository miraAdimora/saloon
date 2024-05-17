import React from "react";
import { useState } from 'react';
import PropTypes from "prop-types";
import { Card, Button, Col, Badge, Stack } from "react-bootstrap";
import { FaHeart, FaTrash } from "react-icons/fa";
import { TiDelete } from "react-icons/ti"
import Modal from 'react-bootstrap/Modal';
import { Principal } from "@dfinity/principal";
// import {
//   insertComment
// } from "../../utils/saloon";
// import AddComment from "./AddComment";

const Saloon = ({ saloon, deleteSaloonId }) => {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { id, name, description, location, imageURL, owner } =
  saloon;


    

  // const triggerBuy = () => {
  //   buy(id);
  // };

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
            {/* <Badge bg="secondary" className="ms-auto">
              {soldAmount.toString()} Sold
            </Badge> */}
          </Stack>
        </Card.Header>
        <div className=" ratio ratio-4x3">
          <img src={imageURL} alt={name} style={{ objectFit: "cover" }} />
        </div>
        <Card.Body className="d-flex  flex-column text-center">
  
  {/* <div style={{ display:'flex',alignItems: "left" }}>
    <FaHeart style={{ color: "red", cursor: "pointer", fontSize: '20px' }} onClick={triggerLike}/>
    <span style={{ fontWeight: "bold" }}>{like}</span>
  </div> */}
      <Button variant="success" onClick={handleShow}>
        View saloon details
      </Button>
      
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className=" ratio ratio-4x3">
          <img src={imageURL} alt={name} style={{ objectFit: "cover" }} />
        </div>
        <Card.Title>{name}</Card.Title>
          
            <div className="text-uppercase fw-bold text-secondary text-sm">Description: </div>
            <span>{description}</span>    
          <div>  
             <div className="text-uppercase fw-bold text-secondary">Location: </div>
             <span>{location} </span> 
          </div>
                  
          
          <Card.Text className="text-secondary">
            <span>{Principal.from(owner).toText()}</span>
          </Card.Text>
         
        </Modal.Body>
        <Modal.Footer>
         
          {/* <Button
            variant="outline-dark"
            onClick={triggerBuy}
            className="w-100 py-3"
          >
            Buy for {(price / BigInt(10**8)).toString()} ICP
          </Button>
          <Col>
            <AddComment addComment={addComment} shoeId={id} /> 
          </Col>
      <div variant="success" style={{ color:"blue", cursor:"pointer"}}  onClick={handleShow1}>
        <span>View comment</span>
      </div>
        <Modal show={show1} onHide={handleClose1} centered>
            <Modal.Header closeButton>
                <Modal.Title>Comments</Modal.Title>
            </Modal.Header>
                <Modal.Body>
                   <span>{comments}</span>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose1}>
                        Close
                    </Button>
                   
                </Modal.Footer>
        </Modal>*/}
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