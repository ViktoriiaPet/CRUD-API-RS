import type { product } from "./types.js";
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
    }
 }