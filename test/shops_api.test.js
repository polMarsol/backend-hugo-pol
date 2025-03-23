const assert = require('node:assert')
const { test, describe, beforeEach } = require('node:test')
const supertest = require('supertest')
const app = require("../src/app")
const db = require('../src/utils/db');
const { shopsModel, shopCategoriesModel } = require("../src/models")
const api = supertest(app);

describe('when there are initial shops in the database', () => {
  beforeEach(async () => {
    db.serialize(() => {
      db.run('DELETE FROM shop_categories');
      db.run('DELETE FROM shops');
    });

    db.run(`INSERT INTO shops (ownerId, name, description) VALUES 
      (2, 'Tienda de María', 'Tienda de ropa y accesorios'),
      (3, 'ElectroCarlos', 'Venta de productos electrónicos')
    `);

    db.run(`INSERT INTO shop_categories (shopId, type) VALUES 
      (1, 'Ropa'),
      (1, 'Accesorios'),
      (2, 'Electrónica')
    `);
  });

  test('creating a shop succeeds with valid data', async () => {
    const newShop = {
      ownerId: 4,
      name: 'Tienda de Deportes',
      description: 'Ropa y accesorios deportivos'
    };

    const result = await api
      .post('/api/shops')
      .send(newShop)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const allShops = await shopsModel.getAllShops();
    const shopNames = allShops.map(shop => shop.name);
    assert(shopNames.includes(newShop.name));
  });

  test('fetching all shops returns correct data', async () => {
    const shopsAtStart = await shopsModel.getAllShops();

    const filteredShopsAtStart = shopsAtStart.map(shop => ({
      id: shop.id,
      name: shop.name,
      description: shop.description,
    }));

    const result = await api
      .get('/api/shops')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const filteredResult = result.body.map(shop => ({
      id: shop.id,
      name: shop.name,
      description: shop.description,
    }));

    assert.strictEqual(filteredResult.length, filteredShopsAtStart.length);
    assert.deepStrictEqual(filteredResult, filteredShopsAtStart);
  });


  test('fetching a shop by ID succeeds and includes categories', async () => {
    const shopsAtStart = await shopsModel.getAllShops();
    const shopToRetrieve = shopsAtStart[0];

    const result = await api
      .get(`/api/shops/${shopToRetrieve.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(result.body.id, shopToRetrieve.id);
    assert.strictEqual(result.body.name, shopToRetrieve.name);
    assert.strictEqual(result.body.description, shopToRetrieve.description);
    assert(result.body.categories.length > 0);
  });

  test('adding a category to a shop succeeds', async () => {
    const shopId = 2;
    const newCategory = { categoryType: 'Audio' };

    const result = await api
      .post(`/api/shops/${shopId}/categories`)
      .send(newCategory)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(result.body.message, 'Categoría añadida a la tienda');

    const categories = await shopCategoriesModel.getCategoriesByShopId(shopId);
    const categoryTypes = categories.map(category => category.type);
    assert(categoryTypes.includes(newCategory.categoryType));
  });

  test('deleting a category from a shop succeeds', async () => {
    const shopId = 2;
    const categoryType = 'Electrónica';

    const result = await api
      .delete(`/api/shops/${shopId}/categories/${categoryType}`)
      .expect(204);

    const categories = await shopCategoriesModel.getCategoriesByShopId(shopId);
    const categoryTypes = categories.map(category => category.type);
    assert(!categoryTypes.includes(categoryType));
  });

  test('creating a shop fails with missing data', async () => {
    const newShop = { name: 'Tienda de Zapatos' };

    const result = await api
      .post('/api/shops')
      .send(newShop)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert(result.body.error.includes('El dueño y el nombre de la tienda son obligatorios'));
  });

  test('fetching a non-existing shop returns 404', async () => {
    const nonExistentShopId = 9999;

    const result = await api
      .get(`/api/shops/${nonExistentShopId}`)
      .expect(404)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(result.body.error, 'Tienda no encontrada');
  });


  test('deleting a shop returns 204 and the shop is no longer available', async () => {
    const shopIdToDelete = 2;

    await api
      .delete(`/api/shops/${shopIdToDelete}`)
      .expect(204);

    assert.strictEqual(result.body.error, 'Tienda no encontrada');
  });


  test('deleting a non-existing shop returns 404', async () => {
    const nonExistentShopId = 9999;

    const result = await api
      .delete(`/api/shops/${nonExistentShopId}`)
      .expect(404)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(result.body.error, 'Tienda no encontrada');
  });
});