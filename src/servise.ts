import type { product } from "./types.js";
import type { productNew } from "./types.js";
import { v4 as uuidv4 } from 'uuid';
export let items: product[] = [
     {
         id: "12",
         "name": "Alice",
         "description":"",
         "price": 1200,
         "category": "food",
         "inStock": true
     },
     {
         "id": "13",
         "name": "Alice",
         "description":"",
         "price": 1200,
         "category": "food",
         "inStock": true
     }
 ];


 
 export const productService = {
    async getByUserId (userId:number) {
       return items.find((user) => Number(user.id) === userId)
    },
    async getAllUsersProducts () {
        return items
    },
    async addNewProduct (product:productNew) {
        const newId = uuidv4();
       const {name, description, price, category, inStock} = product;
        const newProduct:product = {
            id:newId, name, description, price, category, inStock
        }
        items.push(newProduct)
        return newProduct;
    }
 }