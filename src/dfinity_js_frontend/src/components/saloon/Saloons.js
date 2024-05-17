import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Saloon from "./Saloon";
import Loader from "../utils/Loader";
import { Row,Badge } from "react-bootstrap";
import AddSaloon from "./AddSaloon";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getSaloons as getSaloonList, createSaloon, deleteSaloon
} from "../../utils/marketplace";


const Saloons = () => {
  const [saloons, setSaloons] = useState([]);
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



  useEffect(() => {
    getSaloon();
  }, []);

  
  return (
    <>
      {!loading ? (
        <>
          <div className="d-flex justify-content-between align-items-right mb-4">
            <h1 className="fs-4 fw-bold mb-0"></h1>
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
                // likeShoes = {likeShoes}
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