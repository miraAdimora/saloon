import { query, update, text, Record, StableBTreeMap, Variant, Vec, None, Some,int32, Ok, Err, ic, Principal, Opt, nat64, Duration, Result, bool, Canister, int8} from "azle";
import {
    Ledger, binaryAddressFromAddress, binaryAddressFromPrincipal, hexAddressFromPrincipal
} from "azle/canisters/ledger";
// @ts-ignore
import { hashCode } from "hashcode";
import { v4 as uuidv4 } from "uuid";



const ServiceRendered = Record({
    id: text,
    name: text,
    description: text,
});

// Define record types for saloon
const Saloon = Record({
    id: text,
    name: text,
    location: text,
    imageURL: text,
    owner: Principal,
    like: int8,
    services: Vec(ServiceRendered),

});

// saloon Payload
const SaloonPayload = Record({
    name: text,
    location: text,
    imageURL: text,
  
});



//  service Payload record
const ServiceRenderedPayload = Record({
    name: text,
    description: text, 
});



// Define a Message variant for response messages
const Message = Variant({
    NotFound: text,
    NotOwner:text,
    Owner: text,
    InvalidPayload: text,
});

// Define a StableBTreeMap to store Saloons and Services rendered by their IDs
const saloonStorage = StableBTreeMap(0, text, Saloon); 
const serviceStorage = StableBTreeMap(1, text, ServiceRendered);



// Define the Ledger canister
const icpCanister = Ledger(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"));

// Define the canister interface
export default Canister({

    // Create a Saloon
    addSaloon: update([SaloonPayload], Result(Saloon, Message), (payload) => {
        if (typeof payload !== "object" || Object.keys(payload).length === 0) {
            return Err({ InvalidPayload: "invalid payload" })
        }
        const saloon = { id: uuidv4(), owner: ic.caller(), like:0, services: [], ...payload };
        saloonStorage.insert(saloon.id, saloon);
        return Ok(saloon);
    }
    ),

    // Delete a saloon by id
    deleteSaloon: update([text], Result(Saloon, Message), (id) => {
        const deletedSaloonOpt = saloonStorage.get(id);
        if ("None" in deletedSaloonOpt) {
            return Err({ NotFound: `cannot delete the salon: saloon with id=${id} not found` });
        }
        saloonStorage.remove(id);
        return Ok(deletedSaloonOpt.Some);
    }
    ),

    // Get all saloon
    getSaloons: query([], Vec(Saloon),() => {
        return saloonStorage.values();
    }),

    // Get a saloon by id
    getSaloon: query([text], Result(Saloon, Message), (id) => {
        const recipeOpt = saloonStorage.get(id);
        if ("None" in recipeOpt) {
            return Err({ NotFound: `saloon with id=${id} not found` });
        }
        return Ok(recipeOpt.Some);
    }
    ),

      // Create a service
      addServices: update([ServiceRenderedPayload], Result(ServiceRendered, Message), (payload) => {
        if (typeof payload !== "object" || Object.keys(payload).length === 0) {
            return Err({ InvalidPayload: "invalid payoad" })
        }
        const services = { id: uuidv4(), ...payload };
        serviceStorage.insert(services.id, services);
        return Ok(services);
    }
    ),

        // Delete a service
        deleteService: update([text], Result(ServiceRendered, Message), (id) => {
            const deletedServiceOpt = serviceStorage.get(id);
            if ("None" in deletedServiceOpt) {
                return Err({ NotFound: `cannot delete the service: service with id=${id} not found` });
            }
            serviceStorage.remove(id);
            return Ok(deletedServiceOpt.Some);
        }
        ),
    

     // Get all service
     getServices: query([], Vec(ServiceRendered),() => {
        return serviceStorage.values();
     }),
     

     // Get service by id
     getService: query([text], Result(ServiceRendered, Message), (id) => {
        const serviceOpt = serviceStorage.get(id);
        if ("None" in serviceOpt) {
            return Err({ NotFound: `service with id=${id} not found` });
        }
        return Ok(serviceOpt.Some);
     }
     ),

    
    // insert an service to a saloon
    insertServicesToSaloon: update([text, text], Result(Saloon, Message), (saloonId, serviceId) => {
        const saloonOpt = saloonStorage.get(saloonId);
        if ("None" in saloonOpt) {
            return Err({ NotFound: `cannot add service to recipe: saloon with id=${saloonId} not found` });
        }
        const serviceOpt = serviceStorage.get(serviceId);
        if ("None" in serviceOpt) {
            return Err({ NotFound: `cannot add service to saloon: service with id=${serviceId} not found` });
        }
        saloonOpt.Some.services.push(serviceOpt.Some);
        saloonStorage.insert(saloonId, saloonOpt.Some);
        return Ok(saloonOpt.Some);
    }
    ),

    // Function that like a saloon 
    likeSaloon: update([text], Result(Saloon, Message), (id) => {
    const shoeOpt = saloonStorage.get(id);

    if ("None" in shoeOpt) {
        return Err({ NotFound: `cannot like the saloon: saloon with id=${id} not found` });
    }
    const saloon = shoeOpt.Some;
    saloon.like += 1;

    saloonStorage.insert(saloon.id, saloon)
        return Ok(saloon);
    }),

   //function that search for a saloon by name
    searchSaloons: query([text], Vec(Saloon), (name) => {
     const saloons = saloonStorage.values();
     return saloons.filter((saloons) =>
        saloons.name.toLowerCase().includes(name.toLowerCase())
    );
    }),


})


// a workaround to make uuid package work with Azle
globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    }
}



