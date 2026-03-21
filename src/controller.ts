import type { FastifyReply } from "fastify";
import type { FastifyRequest } from "fastify";
import { productService } from "./servise.js";
import type { productNew } from "./types.js";


type GetUserProductsParams = {
  Params: { userId: string }
};

export async function getUserProducts(
  request: FastifyRequest<GetUserProductsParams>,
  reply: FastifyReply
) {
    const userId = Number(request.params.userId);
    const products = await productService.getByUserId(userId);
    if (!products) return reply.status(404).send({ error: "Not found" });
  return products;
}

export async function getAllProducts() {
  const products = await productService.getAllUsersProducts()
  return products
}

export async function createProduct(
  request: FastifyRequest<{ Body: productNew }>,
  reply: FastifyReply
) {
  console.log('request:',request.body)
  const productAdded =  await productService.addNewProduct(request.body)
  if (!productAdded) return reply.status(404).send({ error: " Do not contain required fields or if price is not a positive number" });
  return reply.status(201).send({productAdded});

}