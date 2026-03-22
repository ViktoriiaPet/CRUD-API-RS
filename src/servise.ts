import type { product } from "./types.js";
import type { productNew } from "./types.js";
import { randomUUID } from "node:crypto";
import type { UpdateProductParams } from "./types.js";
 let items: product[] = [];


 
 export const productService = {
    async getByUserId (userId:string) {
    if (process.send) {
      return sendToMaster('GET_ONE', { id: userId });
    }
    return items.find((user) => user.id === userId);
  },
    async getAllUsersProducts () {
        if (process.send) {
      return sendToMaster('GET_ALL');
    }
        return items
    },
    async addNewProduct (product:productNew) {
        const newId = randomUUID();
       const {name, description, price, category, inStock} = product;
        const newProduct: product = {
            id:newId, name, description, price, category, inStock
        }
        if (process.send) {
        return sendToMaster('CREATE', newProduct);
    }
        items.push(newProduct)
        return newProduct;
    },
    async updateProduct(product: Partial<productNew>, id: string){
      if (process.send) {
      return sendToMaster('UPDATE', { id, data: product });
    }
        const productForUpdate = items.find(item => item.id === id);

          if (!productForUpdate) {
          return null;
  }
         Object.assign(productForUpdate, product);
         return productForUpdate;
    },
    async deleteProduct(id: string) {
        if (process.send) {
      return sendToMaster('DELETE', { id });
    }
    const index = items.findIndex(item => item.id === id);
    if (index === -1) {
    return false;
  }
    items.splice(index, 1);
    return true;
}
 }
 function sendToMaster(type: string, payload?: any) {
  return new Promise((resolve, reject) => {
    const requestId = crypto.randomUUID();

    const listener = (msg: any) => {
      if (msg.requestId === requestId) {
        process.off('message', listener);

        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };

    process.on('message', listener);

    process.send?.({ type, payload, requestId });
  });
}