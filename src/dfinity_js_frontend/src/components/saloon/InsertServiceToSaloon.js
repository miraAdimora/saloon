import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Table } from "react-bootstrap";
import {toast} from 'react-toastify';
import { insertServicesToSaloon, getServices as getServicesList } from "../../utils/marketplace";
import { NotificationError, NotificationSuccess } from "../utils/Notifications";


const InsertServices = ({saloonId}) => {

    const [services, setServices] = useState([]);

    const [loading, setLoading] = useState(false);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    // get service
    const getServices = async () => {
        try {
            setLoading(true);
            const services = await getServicesList();
            setServices(services);
        } catch (error) {
            toast(<NotificationError text="Failed to get service." />);
        } finally {
            setLoading(false);
        }
    }

    const handleInsertService = async (serviceId) => {
        try {
            await insertServicesToSaloon(saloonId, serviceId);
            toast(<NotificationSuccess text="service Insert successfully." />);

        } catch (error) {
            console.log({ error });
            toast(<NotificationError text="service insert not successfully." />);
        }
    }

    useEffect(() => {
        getServices();
    }, []);

  return (
    <>
    <Button variant="primary"       
      className="mb-3"
        onClick={handleShow}>
        Insert Service to Saloon
    </Button>

    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Insert Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Description</th>
                        {/* <th>Unit</th>
                        <th>Action</th> */}
                    </tr>
                </thead>
                <tbody>
                    {services.map((service, index) => (
                        <tr key={service.id}>
                            <td>{index + 1}</td>
                            <td>{service.name}</td>
                            <td>{service.description}</td>
                            <td className="d-flex justify-content-between">
                                <Button
                                    variant="primary"
                                    
                                    onClick={() => handleInsertService(service.id)}
                                >
                                    Insert
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>
    </>
  )
}

export default InsertServices