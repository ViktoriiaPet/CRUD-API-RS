import { describe, it, expect, beforeAll, afterAll } from 'vitest';


const BASE_URL = 'http://localhost:4000/api/products';

describe('Products API Scenarios via HTTP', () => {



  // ---------------- SCENARIO 1 ----------------
  it('Scenario 1: Full lifecycle of a single product', async () => {
    // 1. GET all and than empty (or >=0, it depends on server state)
    let res = await fetch(BASE_URL);
    expect(res.status).toBe(200);
    let body = await res.json();
    expect(Array.isArray(body.products)).toBe(true);

    // 2. POST new product
    const productData = {
      name: 'Book A',
      description: 'A good book',
      price: 12.5,
      category: 'books',
      inStock: true
    };
    res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    expect(res.status).toBe(201);
    const created = (await res.json()).productAdded;
    expect(created.id).toBeDefined();
    expect(created.name).toBe('Book A');

    // 3. GET by id
    res = await fetch(`${BASE_URL}/${created.id}`);
    expect(res.status).toBe(200);
    body = await res.json();
    expect(body.id).toBe(created.id);

    // 4. PUT update
    const updatedData = { name: 'Book A Updated', price: 15 };
    res = await fetch(`${BASE_URL}/${created.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });
    expect(res.status).toBe(200);
    body = await res.json();
    expect(body.name).toBe('Book A Updated');
    expect(body.price).toBe(15);

    // 5. DELETE
    res = await fetch(`${BASE_URL}/${created.id}`, { method: 'DELETE' });
    expect(res.status).toBe(204);

    // 6. GET deleted znf thennn 404
    res = await fetch(`${BASE_URL}/${created.id}`);
    expect(res.status).toBe(404);
  });




  // ---------------- SCENARIO 2 ----------------
  it('Scenario 2: Invalid productId handling', async () => {
    // GET with invalid UUID
    let res = await fetch(`${BASE_URL}/invalid-uuid`);
    expect(res.status).toBe(400);

    // PUT with non-existing valid UUID
    res = await fetch(`${BASE_URL}/3fecbeeb-9d8e-4605-958d-bbcfef450d90`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test' })
    });
    expect(res.status).toBe(404);

    // DELETE non-existing UUID
    res = await fetch(`${BASE_URL}/3fecbeeb-9d8e-4605-958d-bbcfef450d90`, { method: 'DELETE' });
    expect(res.status).toBe(404);
  });



  // ---------------- SCENARIO 3 ----------------
  it('Scenario 3: Multiple products handling', async () => {
    const productsToCreate = [
      { name: 'Prod1', description: 'Desc1', price: 10, category: 'books', inStock: true },
      { name: 'Prod2', description: 'Desc2', price: 20, category: 'electronics', inStock: false }
    ];
    const createdIds: string[] = [];

    // POST Create products
    for (const p of productsToCreate) {
      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      expect(res.status).toBe(201);
      const created = (await res.json()).productAdded;
      createdIds.push(created.id);
    }

    // GET all and then should include created products
    let res = await fetch(BASE_URL);
    expect(res.status).toBe(200);
    const allProducts = (await res.json()).products;
    expect(allProducts.length).toBeGreaterThanOrEqual(createdIds.length);

    // DELETE created products
    for (const id of createdIds) {
      res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
      expect(res.status).toBe(204);
    }
  });

});