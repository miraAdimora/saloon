import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";

// add saloon
export async function createSaloon(saloon) {
    return window.canister.marketplace.addSaloon(saloon);
}

// delete saloon
export async function deleteSaloon(id) {
    return window.canister.marketplace.deleteSaloon(id);
}

// search Saloon
export async function searchSaloons(query) {
    return window.canister.marketplace.searchSaloons(query);
  }

// add service
export async function createService(service) {
    return window.canister.marketplace.addService(service);
  }  

  // get services
export async function getServices() {
    return await window.canister.marketplace.getServices();
  }


  // delete service 
export async function deleteService(id) {
  return window.canister.marketplace.deleteService(id);
}

 // add Service To saloon
export async function insertServicesToSaloon(saloonId, serviceId) {
    return window.canister.marketplace.insertServicesToSaloon(saloonId, serviceId);
  } 

  // like a saloon
export async function likeSaloon(id) {
  return window.canister.marketplace.likeSaloon(id);
}

//get Saloon
export async function getSaloons() {
    try {
        return await window.canister.marketplace.getSaloons();
    } catch (err) {
        if (err.name === "AgentHTTPResponseError") {
            const authClient = window.auth.client;
            await authClient.logout();
        }
        return [];
    }
}

// export async function buyProduct(product) {
//     const marketplaceCanister = window.canister.marketplace;
//     const orderResponse = await marketplaceCanister.createOrder(product.id);
//     const sellerPrincipal = Principal.from(orderResponse.Ok.seller);
//     const sellerAddress = await marketplaceCanister.getAddressFromPrincipal(sellerPrincipal);
//     const block = await transferICP(sellerAddress, orderResponse.Ok.price, orderResponse.Ok.memo);
//     await marketplaceCanister.completePurchase(sellerPrincipal, product.id, orderResponse.Ok.price, block, orderResponse.Ok.memo);
// }