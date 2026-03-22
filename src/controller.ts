import type { FastifyReply } from "fastify";
import type { FastifyRequest } from "fastify";
import { productService } from "./servise.js";
import type { productNew } from "./types.js";
import { validate as isUuid } from 'uuid';

type GetUserProductsParams = {
  Params: { productId: string }
};

export async function getUserProducts(
  request: FastifyRequest<GetUserProductsParams>,
  reply: FastifyReply
) {
    const userId = request.params.productId;
    const products = await productService.getByUserId(userId);
    if (!isUuid(userId)) {
    return reply.status(400).send({ error: 'Invalid productId' });
  }
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
  const productAdded =  await productService.addNewProduct(request.body)
  if (!productAdded) return reply.status(404).send({ error: " Do not contain required fields or if price is not a positive number" });
  return reply.status(201).send({productAdded});
}

export async function updateProductById(
  request: FastifyRequest<{
    Params: { productId: string };
    Body: Partial<productNew>;
  }>,
  reply: FastifyReply) {
     if (!isUuid(request.params.productId)) {
    return reply.status(400).send({ error: 'Invalid productId' });
  }
  const productUpdated = await productService.updateProduct(request.body, request.params.productId)

  if (!productUpdated) {
    return reply.status(404).send({ error: 'Product not found' });
  }
  return reply.status(200).send(productUpdated);
}
export async function deleteProductById(
  request: FastifyRequest<{ Params: { productId: string } }>,
  reply: FastifyReply
) {
  const { productId } = request.params;
  if (!isUuid(productId)) {
    return reply.status(400).send({ error: 'Invalid productId' });
  }
  const deleted = await productService.deleteProduct(productId);
  if (!deleted) {
    return reply.status(404).send({ error: 'Product not found' });
  }
  return reply.status(204).send();
}