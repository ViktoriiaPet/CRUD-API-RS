# CRUD-API-RS
## To run the project, first install dependencies:

npm install

## For API testing, Postman was used.
Example base URL (if PORT=4000):

http://localhost:4000/api/products

## Available API endpoints

GET /api/products
Returns all products

GET /api/products/{productId}
Returns a product by id (id must be provided in the URL)

POST /api/products
Creates a new product
Request body must contain:
{
name: string,
description: string,
price: number,
category: string,
inStock: boolean
}


PUT /api/products/{productId}
Updates an existing product (id must be provided in the URL)
Request body should contain product fields to update

DELETE /api/products/{productId}
Deletes a product by id (id must be provided in the URL)

## Responses and errors
200 — successful request
201 — product successfully created
204 — product successfully deleted
400 — invalid id or invalid request body
404 — product not found or endpoint does not exist
500 — internal server error
Environment variables

The application uses a .env file to store configuration.
Example is provided in .env.example:

PORT=4000

Note: .env file should not be committed to the repository.

## Run modes

Development mode (no build, runs directly):
npm run start:dev

Production mode (builds project into /dist and runs compiled code):
npm run start:prod

Multi-instance mode with load balancing (round-robin):
npm run start:multi

## Tests

Tests can be run with:

npm run test

There are 3 test scenarios.