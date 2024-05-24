import {
  query,
  update,
  text,
  Record,
  StableBTreeMap,
  Variant,
  Vec,
  int8,
  Ok,
  Err,
  ic,
  Principal,
  Result,
  Canister,
} from "azle";
// import { Ledger } from "azle/canisters/ledger";
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
  liked: Vec(text),
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
  AlreadyLiked: text,
  AuthenticationFailed: text
});

// Define StableBTreeMaps to store Saloons and Services rendered by their IDs
const saloonStorage = StableBTreeMap(0, text, Saloon);
const serviceStorage = StableBTreeMap(1, text, ServiceRendered);



// Define the canister interface
export default Canister({
  // Create a Saloon
  addSaloon: update([SaloonPayload], Result(Saloon, Message), (payload) => {
    // @ts-ignore
    const validatePayloadErrors = validateSaloonPayload(payload);
    if (validatePayloadErrors.length) {
      return Err({
        InvalidPayload: `Invalid payload. Errors=[${validatePayloadErrors}]`,
      });
    }
    const saloon = {
      id: uuidv4(),
      owner: ic.caller(),
      like: 0,
      liked: [],
      services: [],
      ...payload,
    };
    saloonStorage.insert(saloon.id, saloon);
    return Ok(saloon);
  }),

  // Delete a saloon by id
  deleteSaloon: update([text], Result(Saloon, Message), (id) => {
    if (!isValidUuid(id)) {
      return Err({
        InvalidPayload: `Id=${id} is not in the valid uuid format.`,
      });
    }
    const saloonOpt = saloonStorage.get(id);
    if ("None" in saloonOpt) {
      return Err({
        NotFound: `Cannot delete the saloon: saloon with id=${id} not found`,
      });
    }
    if (saloonOpt.Some.owner.toString() !== ic.caller().toString()) {
        return Err({ AuthenticationFailed: "Caller isn't the saloon's owner" });
    }
    saloonStorage.remove(id);
    return Ok(saloonOpt.Some);
  }),

  // Get all saloons
  getSaloons: query([], Vec(Saloon), () => {
    return saloonStorage.values();
  }),

  // Get a saloon by id
  getSaloon: query([text], Result(Saloon, Message), (id) => {
    if (!isValidUuid(id)) {
      return Err({
        InvalidPayload: `Id=${id} is not in the valid uuid format.`,
      });
    }
    const saloonOpt = saloonStorage.get(id);
    if ("None" in saloonOpt) {
      return Err({ NotFound: `Saloon with id=${id} not found` });
    }
    return Ok(saloonOpt.Some);
  }),

  // Create a service
  addService: update([ServiceRenderedPayload],Result(ServiceRendered, Message),(payload) => {
      // @ts-ignore
      const validatePayloadErrors = validateServiceRenderedPayload(payload);
      if (validatePayloadErrors.length) {
        return Err({
          InvalidPayload: `Invalid payload. Errors=[${validatePayloadErrors}]`,
        });
      }
      const service = { id: uuidv4(), ...payload };
      serviceStorage.insert(service.id, service);
      return Ok(service);
    }
  ),

  // Delete a service
  deleteService: update([text], Result(ServiceRendered, Message), (id) => {
    if (!isValidUuid(id)) {
      return Err({
        InvalidPayload: `Id=${id} is not in the valid uuid format.`,
      });
    }
    const deletedServiceOpt = serviceStorage.get(id);
    if ("None" in deletedServiceOpt) {
      return Err({
        NotFound: `Cannot delete the service: service with id=${id} not found`,
      });
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
    if (!isValidUuid(id)) {
      return Err({
        InvalidPayload: `Id=${id} is not in the valid uuid format.`,
      });
    }
    const serviceOpt = serviceStorage.get(id);
    if ("None" in serviceOpt) {
      return Err({ NotFound: `Service with id=${id} not found` });
    }
    return Ok(serviceOpt.Some);
  }),

  // Insert a service into a saloon
  insertServicesToSaloon: update([text, text],Result(Saloon, Message),(saloonId, serviceId) => {
      if (!isValidUuid(saloonId)) {
        return Err({
          InvalidPayload: `saloonId=${saloonId} is not in the valid uuid format.`,
        });
      }
      if (!isValidUuid(serviceId)) {
        return Err({
          InvalidPayload: `serviceId=${serviceId} is not in the valid uuid format.`,
        });
      }
      const saloonOpt = saloonStorage.get(saloonId);
      if ("None" in saloonOpt) {
        return Err({
          NotFound: `Cannot add service to saloon: saloon with id=${saloonId} not found`,
        });
      }
      if (saloonOpt.Some.owner.toString() !== ic.caller().toString()) {
        return Err({ AuthenticationFailed: "Caller isn't the saloon's owner" });
      }
      // -1 is only returned if the services array does not contain the service
      // @ts-ignore
      if (saloonOpt.Some.services.findIndex(service => service.id == serviceId) > -1) {
        return Err({ InvalidPayload: "Service is already offered by saloon." });
      }
      const serviceOpt = serviceStorage.get(serviceId);
      if ("None" in serviceOpt) {
        return Err({
          NotFound: `Cannot add service to saloon: service with id=${serviceId} not found`,
        });
      }
      saloonOpt.Some.services.push(serviceOpt.Some);
      saloonStorage.insert(saloonId, saloonOpt.Some);
      return Ok(saloonOpt.Some);
    }
  ),

  // Function to like a saloon
  likeSaloon: update([text], Result(Saloon, Message), (id) => {
    if (!isValidUuid(id)) {
      return Err({
        InvalidPayload: `Id=${id} is not in the valid uuid format.`,
      });
    }
    const saloonOpt = saloonStorage.get(id);
    if ("None" in saloonOpt) {
      return Err({
        NotFound: `Cannot like the saloon: saloon with id=${id} not found`,
      });
    }
    const saloon = saloonOpt.Some;
    if (saloon.liked.includes(ic.caller().toString())) {
      return Err({ AlreadyLiked: "Caller has already liked this saloon" });
    }
    saloon.like += 1;
    saloon.liked.push(ic.caller().toString());
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
  updateSaloon: update(
    [text, SaloonPayload],
    Result(Saloon, Message),
    (id, payload) => {
      if (!isValidUuid(id)) {
        return Err({
          InvalidPayload: `Id=${id} is not in the valid uuid format.`,
        });
      }
      // @ts-ignore
      const validatePayloadErrors = validateSaloonPayload(payload);
      if (validatePayloadErrors.length) {
        return Err({
          InvalidPayload: `Invalid payload. Errors=[${validatePayloadErrors}]`,
        });
      }
      const saloonOpt = saloonStorage.get(id);
      if ("None" in saloonOpt) {
        return Err({ NotFound: `Saloon with id=${id} not found` });
      }
      if (saloonOpt.Some.owner.toString() !== ic.caller().toString()) {
        return Err({ AuthenticationFailed: "Caller isn't the saloon's owner" });
        }
      const saloon = { ...saloonOpt.Some, ...payload };
      saloonStorage.insert(id, saloon);
      return Ok(saloon);
    }
  ),

  // Function to update service details
  updateService: update(
    [text, ServiceRenderedPayload],
    Result(ServiceRendered, Message),
    (id, payload) => {
      if (!isValidUuid(id)) {
        return Err({
          InvalidPayload: `Id=${id} is not in the valid uuid format.`,
        });
      }
      // @ts-ignore
      const validatePayloadErrors = validateServiceRenderedPayload(payload);
      if (validatePayloadErrors.length) {
        return Err({
          InvalidPayload: `Invalid payload. Errors=[${validatePayloadErrors}]`,
        });
      }
      const serviceOpt = serviceStorage.get(id);
      if ("None" in serviceOpt) {
        return Err({ NotFound: `Service with id=${id} not found` });
      }
      const service = { ...serviceOpt.Some, ...payload };
      serviceStorage.insert(id, service);
      return Ok(service);
    }
  ),
});

// Helper function that trims the input string and then checks the length
// The string is empty if true is returned, otherwise, string is a valid value
function isInvalidString(str: text): boolean {
  return str.trim().length == 0;
}

// Helper function to ensure the input id meets the format used for ids generated by uuid
function isValidUuid(id: string): boolean {
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExp.test(id);
}

/**
 * Helper function to validate the SaloonPayload
 */
function validateSaloonPayload(payload: typeof SaloonPayload): Vec<string> {
  const errors: Vec<text> = [];
  // @ts-ignore
  if (isInvalidString(payload.name)) {
    errors.push(`name='${payload.name}' cannot be empty.`);
  }
  // @ts-ignore
  if (isInvalidString(payload.imageURL)) {
    errors.push(`imageURL='${payload.imageURL}' cannot be empty.`);
  }
  // @ts-ignore
  if (isInvalidString(payload.location)) {
    errors.push(`location='${payload.location}' cannot be empty.`);
  }
  return errors;
}
/**
 * Helper function to validate the ServiceRenderedPayload
 */
function validateServiceRenderedPayload(
  payload: typeof ServiceRenderedPayload
): Vec<string> {
  const errors: Vec<text> = [];
  // @ts-ignore
  if (isInvalidString(payload.name)) {
    errors.push(`name='${payload.name}' cannot be empty.`);
  }
  // @ts-ignore
  if (isInvalidString(payload.description)) {
    errors.push(`description='${payload.description}' cannot be empty.`);
  }
  return errors;
}

// a workaround to make uuid package work with Azle
globalThis.crypto = {
  // @ts-ignore
  getRandomValues: () => {
    let array = new Uint8Array(32);
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  },
};
