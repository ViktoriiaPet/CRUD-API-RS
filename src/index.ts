import Fastify from "fastify";
import { getUserProducts } from "./controller.js";
import { items } from "./servise.js";
import { getAllProducts } from "./controller.js";
import dotenv from "dotenv";
import { createProduct } from "./controller.js";
import { productRoutes } from "./routes/productsRouts.js";

dotenv.config();
const PORT = Number(process.env.PORT);

if (isNaN(PORT)) {
  throw new Error("PORT is not defined or invalid in .env");
}
const fastify = Fastify({
  logger: true
})
await fastify.register(productRoutes, { prefix: '/api' });

fastify.setNotFoundHandler((request, reply) => {
  reply.status(404).send({
    error: 'Route not found'
  });
});

try {
  await fastify.listen({ port: PORT })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}