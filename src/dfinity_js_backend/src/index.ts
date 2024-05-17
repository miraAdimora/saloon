import { query, update, text, Record, StableBTreeMap, Variant, Vec, None, Some,int32, Ok, Err, ic, Principal, Opt, nat64, Duration, Result, bool, Canister, int8} from "azle";
import {
    Ledger, binaryAddressFromAddress, binaryAddressFromPrincipal, hexAddressFromPrincipal
} from "azle/canisters/ledger";
// @ts-ignore
import { hashCode } from "hashcode";
import { v4 as uuidv4 } from "uuid";




// Define record types for Shoe
const ServiceRendered = Record({
    id: text,
    serviceName: text,
    serviceDescription: text,
    serviceAmount: nat64, 
});

// Define record types for Shoe
const Saloon = Record({
    id: text,
    name: text,
    location: text,
    description: text,
    imageURL: text,
    owner: Principal,
    services: Vec(ServiceRendered),

});

// Define a shoe Payload record
const SaloonPayload = Record({
    name: text,
    location: text,
    description: text,
    imageURL: text,
  
});



// Define a shoe Payload record
const ServiceRenderedPayload = Record({
    serviceName: text,
    serviceDescription: text, 
    serviceAmount: nat64, 
});



// Define a Message variant for response messages
const Message = Variant({
    NotFound: text,
    NotOwner:text,
    Owner: text,
    InvalidPayload: text,
    // PaymentFailed: text,
    // PaymentCompleted: text,
    // AlreadyLiked: text,
});

// Define a StableBTreeMap to store Saloon and Service rendered by their IDs
const saloonStorage = StableBTreeMap(0, text, Saloon); 
const serviceStorage = StableBTreeMap(0, text, ServiceRendered);


// const ORDER_RESERVATION_PERIOD = 120n;

// Define the Ledger canister
const icpCanister = Ledger(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"));

// Define the canister interface
export default Canister({

    // Create a Saloon
    addSaloon: update([SaloonPayload], Result(Saloon, Message), (payload) => {
        if (typeof payload !== "object" || Object.keys(payload).length === 0) {
            return Err({ InvalidPayload: "invalid payload" })
        }
        const saloon = { id: uuidv4(), owner: ic.caller(), services: [], ...payload };
        saloonStorage.insert(saloon.id, saloon);
        return Ok(saloon);
    }
    ),

    // Delete a saloon by id
    deleteSaloon: update([text], Result(Saloon, Message), (id) => {
        const deletedSaloonOpt = saloonStorage.get(id);
        if ("None" in deletedSaloonOpt) {
            return Err({ NotFound: `cannot delete the recipe: recipe with id=${id} not found` });
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
            return Err({ NotFound: `recipe with id=${id} not found` });
        }
        return Ok(recipeOpt.Some);
    }
    ),

  







 
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



