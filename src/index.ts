import Fastify from "fastify";
import { getUserProducts } from "./controller.js";
import { items } from "./servise.js";
const fastify = Fastify({
  logger: true
})


fastify.get('/api/products/', async () => items);

fastify.get<{Params: { userId: string }}> ('/api/products/:userId', getUserProducts)

try {
  await fastify.listen({ port: 4000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}