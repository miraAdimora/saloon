import { query, update, text, Record, StableBTreeMap, Variant, Vec, None, Some, int8, Ok, Err, ic, Principal, Result, Canister } from "azle";
import { Ledger } from "azle/canisters/ledger";
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

// Saloon Payload
const SaloonPayload = Record({
    name: text,
    location: text,
    imageURL: text,
});

// Service Payload
const ServiceRenderedPayload = Record({
    name: text,
    description: text, 
});

// Define a Message variant for response messages
const Message = Variant({
    NotFound: text,
    NotOwner: text,
    InvalidPayload: text,
});


// Define StableBTreeMaps to store Saloons and Services rendered by their IDs
const saloonStorage = StableBTreeMap(0, text, Saloon); 
const serviceStorage = StableBTreeMap(1, text, ServiceRendered);


// Define the Ledger canister
const icpCanister = Ledger(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"));


// Define the canister interface
export default Canister({
    // Create a Saloon
    addSaloon: update([SaloonPayload], Result(Saloon, Message), (payload) => {
        const saloon = { id: uuidv4(), owner: ic.caller(), like: 0, services: [], ...payload };
        saloonStorage.insert(saloon.id, saloon);
        return Ok(saloon);
    }),


    // Delete a saloon by id
    deleteSaloon: update([text], Result(Saloon, Message), (id) => {
        const deletedSaloonOpt = saloonStorage.get(id);
        if ("None" in deletedSaloonOpt) {
            return Err({ NotFound: `Cannot delete the saloon: saloon with id=${id} not found` });
        }
        saloonStorage.remove(id);
        return Ok(deletedSaloonOpt.Some);
    }),

    // Get all saloons
    getSaloons: query([], Vec(Saloon), () => {
        return saloonStorage.values();
    }),

    // Get a saloon by id
    getSaloon: query([text], Result(Saloon, Message), (id) => {
        const saloonOpt = saloonStorage.get(id);
        if ("None" in saloonOpt) {
            return Err({ NotFound: `Saloon with id=${id} not found` });
        }
        return Ok(saloonOpt.Some);
    }),

    // Create a service
    addService: update([ServiceRenderedPayload], Result(ServiceRendered, Message), (payload) => {
        const service = { id: uuidv4(), ...payload };
        serviceStorage.insert(service.id, service);
        return Ok(service);
    }),

    // Delete a service
    deleteService: update([text], Result(ServiceRendered, Message), (id) => {
        const deletedServiceOpt = serviceStorage.get(id);
        if ("None" in deletedServiceOpt) {
            return Err({ NotFound: `Cannot delete the service: service with id=${id} not found` });
        }
        serviceStorage.remove(id);
        return Ok(deletedServiceOpt.Some);
    }),

    // Get all services
    getServices: query([], Vec(ServiceRendered), () => {
        return serviceStorage.values();
    }),

    // Get a service by id
    getService: query([text], Result(ServiceRendered, Message), (id) => {
        const serviceOpt = serviceStorage.get(id);
        if ("None" in serviceOpt) {
            return Err({ NotFound: `Service with id=${id} not found` });
        }
        return Ok(serviceOpt.Some);
    }),

    // Insert a service into a saloon
    insertServicesToSaloon: update([text, text], Result(Saloon, Message), (saloonId, serviceId) => {
        const saloonOpt = saloonStorage.get(saloonId);
        if ("None" in saloonOpt) {
            return Err({ NotFound: `Cannot add service to saloon: saloon with id=${saloonId} not found` });
        }
        const serviceOpt = serviceStorage.get(serviceId);
        if ("None" in serviceOpt) {
            return Err({ NotFound: `Cannot add service to saloon: service with id=${serviceId} not found` });
        }
        saloonOpt.Some.services.push(serviceOpt.Some);
        saloonStorage.insert(saloonId, saloonOpt.Some);
        return Ok(saloonOpt.Some);
    }),

    // Function to like a saloon
    likeSaloon: update([text], Result(Saloon, Message), (id) => {
        const saloonOpt = saloonStorage.get(id);
        if ("None" in saloonOpt) {
            return Err({ NotFound: `Cannot like the saloon: saloon with id=${id} not found` });
        }
        const saloon = saloonOpt.Some;
        saloon.like += 1;
        saloonStorage.insert(saloon.id, saloon);
        return Ok(saloon);
    }),

    // Function to search for a saloon by name
    searchSaloons: query([text], Vec(Saloon), (name) => {
        const saloons = saloonStorage.values();
        return saloons.filter((saloon) =>
            saloon.name.toLowerCase().includes(name.toLowerCase())
        );
    }),

    // Function to update saloon details
    updateSaloon: update([text, SaloonPayload], Result(Saloon, Message), (id, payload) => {
        const saloonOpt = saloonStorage.get(id);
        if ("None" in saloonOpt) {
            return Err({ NotFound: `Saloon with id=${id} not found` });
        }
        const saloon = { ...saloonOpt.Some, ...payload };
        saloonStorage.insert(id, saloon);
        return Ok(saloon);
    }),

    // Function to update service details
    updateService: update([text, ServiceRenderedPayload], Result(ServiceRendered, Message), (id, payload) => {
        const serviceOpt = serviceStorage.get(id);
        if ("None" in serviceOpt) {
            return Err({ NotFound: `Service with id=${id} not found` });
        }
        const service = { ...serviceOpt.Some, ...payload };
        serviceStorage.insert(id, service);
        return Ok(service);
    }),
});


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
};
