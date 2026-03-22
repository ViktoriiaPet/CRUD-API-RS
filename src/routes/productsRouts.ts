import type { FastifyInstance } from 'fastify';
import type { productNew } from '../types.js';
import { createProduct } from '../controller.js';
import { getAllProducts } from '../controller.js';
import { getUserProducts } from '../controller.js';
import { updateProductById } from '../controller.js';
import type { UpdateProductParams } from '../types.js';
import { deleteProductById } from '../controller.js';

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
        201: {
          type: 'object',
          properties: {
            productAdded:         {type: 'object',
        required: ['id', 'name', 'description', 'price', 'category', 'inStock'],
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          category: { type: 'string' },
          inStock: { type: 'boolean' },
        },
      },
          },
        },
      },
    },
  }, createProduct);
    fastify.get('/products', async (request, reply) => {
    return { products: await getAllProducts() };
  });
  fastify.get<{Params: { productId: string }}> ('/products/:productId', getUserProducts)
  fastify.put<UpdateProductParams>('/products/:productId', updateProductById)
  fastify.delete<{
  Params: { productId: string };}>('/products/:productId', deleteProductById);
}