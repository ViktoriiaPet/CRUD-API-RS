import Fastify from "fastify";
import dotenv from "dotenv";
import { productRoutes } from "./routes/productsRouts.js";
import cluster from 'node:cluster';
import os from 'node:os';
import http from 'node:http';

dotenv.config();
const PORT = Number(process.env.PORT) || 4000;

if (isNaN(PORT)) {
  throw new Error("PORT is not defined or invalid in .env");
}
const numCPUs = os.availableParallelism() - 1;

const isMulti = process.env.MODE === 'multi';

if (isMulti && cluster.isPrimary) {
  const workers: { worker: any; port: number }[] = [];
  const products: any[] = [];

  for (let i = 0; i < numCPUs; i++) {
    const port = PORT + i + 1;

    const worker = cluster.fork({
      PORT: port 
    });

    workers.push({ worker, port });

    worker.on('message', (msg: any) => {
      const { type, payload, requestId } = msg;
      let result;

      switch (type) {
        case 'GET_ALL':
          result = products;
          break;

        case 'GET_ONE':
          result = products.find(p => p.id === payload.id);
          break;

        case 'CREATE':
          products.push(payload);
          result = payload;
          break;

        case 'UPDATE':
          const index = products.findIndex(p => p.id === payload.id);
          if (index === -1) result = null;
          else {
            Object.assign(products[index], payload.data);
            result = products[index];
          }
          break;

        case 'DELETE':
          const i = products.findIndex(p => p.id === payload.id);
          if (i === -1) result = false;
          else {
            products.splice(i, 1);
            result = true;
          }
          break;
      }

      worker.send({ requestId, result });
    });
  }

  let current = 0;

  const server = http.createServer((req, res) => {
    const { worker, port } = workers[current]!;
    current = (current + 1) % workers.length;

    const proxy = http.request(
      {
        hostname: 'localhost',
        port: port,
        path: req.url,
        method: req.method,
        headers: req.headers
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
        proxyRes.pipe(res);
      }
    );

    proxy.on('error', () => {
      res.writeHead(500);
      res.end('Proxy error');
    });

    req.pipe(proxy);
  });



  server.listen(PORT, () => {
    console.log(`Load balancer on ${PORT}`);
  });
    console.log('MODE:', process.env.MODE);
  console.log('isPrimary:', cluster.isPrimary);
  console.log('PORT:', process.env.PORT);
} 
if (!isMulti || !cluster.isPrimary) {

  const fastify = Fastify({ logger: true });

  await fastify.register(productRoutes, { prefix: '/api' });

  console.log('MODE:', process.env.MODE);
  console.log('isPrimary:', cluster.isPrimary);
  console.log('PORT:', process.env.PORT);

  fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).send({ error: 'Route not found' });
  });

  fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);
    reply.status(500).send({
      error: 'Internal Server Error',
      message: 'Something went wrong on the server.'
    });
  });

  await fastify.listen({ port: Number(process.env.PORT) });
}