import Fastify from "fastify";
import { getUserProducts } from "./controller.js";
import { items } from "./servise.js";
import { getAllProducts } from "./controller.js";
import dotenv from "dotenv";
import { createProduct } from "./controller.js";

dotenv.config();
const PORT = Number(process.env.PORT);

if (isNaN(PORT)) {
  throw new Error("PORT is not defined or invalid in .env");
}
const fastify = Fastify({
  logger: true
})

fastify.get('/api/products/', getAllProducts);
fastify.post('/api/products/', createProduct)

fastify.get<{Params: { userId: string }}> ('/api/products/:userId', getUserProducts)
try {
  await fastify.listen({ port: PORT })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}