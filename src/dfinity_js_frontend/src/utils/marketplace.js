import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";

// add shoe to the store
export async function createSaloon(saloon) {
    return window.canister.marketplace.addSaloon(saloon);
}

// delete shoe by the shoe id
export async function deleteSaloon(id) {
    return window.canister.marketplace.deleteSaloon(id);
}

// searchRecipes
export async function searchSaloons(query) {
    return window.canister.marketplace.searchSaloons(query);
  }

// add service
export async function createService(service) {
    return window.canister.marketplace.addServices(service);
  }  

  // get services
export async function getServices() {
    return await window.canister.marketplace.getServices();
  }

 // add Service To saloon
export async function insertServicesToSaloon(saloonId, serviceId) {
    return window.canister.marketplace.insertServicesToSaloon(saloonId, serviceId);
  } 

// // like a shoe
// export async function likeShoe(id) {
//     return window.canister.marketplace.likeShoe(id);
// }

// // getNoOfShoes
// export async function getNoOfShoes() {
//     return window.canister.marketplace.getNoOfShoes();
//   }

  //addComment
// export async function insertComment(id,comment) {
//     return window.canister.marketplace.insertComment(id,comment);
//   }
// //getComment
// export async function getComments() {
//     return window.canister.marketplace.getComments();
//   }

//getShoe
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

// export async function buyShoe(shoe) {
//     const marketplaceCanister = window.canister.marketplace;
//     const orderResponse = await marketplaceCanister.createOrder(shoe.id);
//     const sellerPrincipal = Principal.from(orderResponse.Ok.seller);
//     const sellerAddress = await marketplaceCanister.getAddressFromPrincipal(sellerPrincipal);
//     const block = await transferICP(sellerAddress, orderResponse.Ok.price, orderResponse.Ok.memo);
//     await marketplaceCanister.completePurchase(sellerPrincipal, shoe.id, orderResponse.Ok.price, block, orderResponse.Ok.memo);
// }