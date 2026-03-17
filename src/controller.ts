import type { FastifyReply } from "fastify";
import type { FastifyRequest } from "fastify";
import { productService } from "./servise.js";

type GetUserProductsParams = {
  Params: { userId: string }
};

export async function getUserProducts(
  request: FastifyRequest<GetUserProductsParams>,
  reply: FastifyReply
) {
  const userId = Number(request.params.userId);

  const products = await productService.getByUserId(userId);

  return products;
}