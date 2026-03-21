import type { FastifyInstance } from 'fastify';
import type { productNew } from '../types.js';
import { createProduct } from '../controller.js';
import { getAllProducts } from '../controller.js';
import { getUserProducts } from '../controller.js';

export async function productRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: productNew }>('/products', {
    schema: {
      body: {
        type: 'object',
        required: ['name', 'description', 'price', 'category', 'inStock'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          category: { type: 'string' },
          inStock: { type: 'boolean' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            productAdded: { $ref: 'product#' },
          },
        },
      },
    },
  }, createProduct);
    fastify.get('/products', async (request, reply) => {
    return { products: getAllProducts() };
  });
  fastify.get<{Params: { userId: string }}> ('/api/products/:userId', getUserProducts)
  
}