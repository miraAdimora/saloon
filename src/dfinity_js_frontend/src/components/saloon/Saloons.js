import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Saloon from "./Saloon";
import Loader from "../utils/Loader";
import { Row,Button, InputGroup, Form  } from "react-bootstrap";
import AddSaloon from "./AddSaloon";
import { FaSearch } from "react-icons/fa";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getSaloons as getSaloonList,getServices as getServicesList, createSaloon, createService, deleteSaloon,likeSaloon
} from "../../utils/marketplace";
import AddService from "../servicesRendered/AddService";


const Saloons = () => {
  const [saloons, setSaloons] = useState([]);
  const [searchSaloon, setSearchSaloon] = useState('');
  const [loading, setLoading] = useState(false);


  // function to get the list of shoe
  const getSaloon = useCallback(async () => {
    try {
      // setLoading(true);
      setSaloons(await getSaloonList());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  const getService = async () => {
    try {
        setLoading(true);
        await getServicesList();
    } catch (error) {
        toast(<NotificationError text="Failed to get Service." />);
    } finally {
        setLoading(false);
    }
}


 // function that delete a shoe by the shoe id
  const deleteSaloonId = async (id) => {
    try {
      setLoading(true);
      toast(<NotificationSuccess text="please wait your request is been processed." />);
      deleteSaloon(id).then((resp) => {
        toast(<NotificationSuccess text="Saloon deleted successfully." />);
        getSaloon();
      });
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  };


  // add Saloon
  const addSaloon = async (data) => {
    try {
      setLoading(true);
      const priceStr = data.price;
      data.price = parseInt(priceStr, 10) * 10**8;
      createSaloon(data).then((resp) => {
        getSaloon();
             
      });
      toast(<NotificationSuccess text="Shoe added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a shoe." />);
    } finally {
      setLoading(false);
    }
  };

   // function that likes a saloon
   const likesSaloon = async (id) => {
    try {
      likeSaloon(id).then((resp) => {
        toast(<NotificationSuccess text="Shoe liked successfully." />);
        getSaloon();
      });
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  };

  const addService = async (data) => {
    try {
      setLoading(true);
      createService(data).then((resp) => {
        getService();
      });
      toast(<NotificationSuccess text="Service added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a service." />);
    } finally {
      setLoading(false);
    }
 };

  const handleChange = (e) => {
    const searchTerm = e.target.value;
      setSearchSaloon(searchTerm);
        if (searchTerm === "") {
           return getSaloon();
      }
     const filtered = saloons.filter(
      (saloon) =>
           (saloon.name.toLowerCase().includes(searchTerm.toLowerCase()))  
     );
       setSaloons(filtered);
     };

  useEffect(() => {
    getSaloon();
  }, []);

  
  return (
    <>
      {!loading ? (
        <> 
        <div className="d-flex justify-content-end align-items-center mb-4">
            <InputGroup className="mb-3 mx-2 mx-2">
              <Form.Control
                placeholder="Search by Name" 
                aria-label="Search"
                aria-describedby="basic-addon2"
                value={searchSaloon}
                onChange={handleChange}
              />
              <FaSearch style={{  fontSize: 33}} />
            </InputGroup>
          </div>
          <div className="d-flex justify-content-between align-items-right mb-4">
            {/* <h1 className="fs-4 fw-bold mb-0"></h1> */}
            <AddService save={addService} />
            <AddSaloon save={addSaloon} />
            
          </div>

         
 
          <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
            {saloons.map((_saloon) => (
              <div>
               <Saloon
                saloon={{
                  ..._saloon,
                }}
                deleteSaloonId = {deleteSaloonId}
                likesSaloon = {likesSaloon}
              />    
              </div>
              
            ))} 
           
          </Row>
         
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Saloons;