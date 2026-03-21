import type { product } from "./types.js";
import type { productNew } from "./types.js";
import { randomUUID } from "node:crypto";
import type { UpdateProductParams } from "./types.js";
export let items: product[] = [
     {
         id: "3fecbeeb-9d8e-4605-958d-bbcfef450d90",
         "name": "Alice",
         "description":"",
         "price": 1200,
         "category": "food",
         "inStock": true
     },
     {
         "id": "3fecbeeb-9d8e-4605-958d-bbcfef450d80",
         "name": "Gumbert",
         "description":"",
         "price": 1200,
         "category": "food",
         "inStock": true
     }
 ];


 
 export const productService = {
    async getByUserId (userId:string) {
       return items.find((user) => (user.id) === userId)
    },
    async getAllUsersProducts () {
        return items
    },
    async addNewProduct (product:productNew) {
        const newId = randomUUID();
       const {name, description, price, category, inStock} = product;
        const newProduct: product = {
            id:newId, name, description, price, category, inStock
        }
        items.push(newProduct)
        return newProduct;
    },
    async updateProduct(product: Partial<productNew>, id: string){
        const productForUpdate = items.find(item => item.id === id);

          if (!productForUpdate) {
          return null;
  }
         Object.assign(productForUpdate, product);
         return productForUpdate;
    },
    async deleteProduct(id: string) {
    const index = items.findIndex(item => item.id === id);
    if (index === -1) {
    return false;
  }
    items.splice(index, 1);
    return true;
}
 }