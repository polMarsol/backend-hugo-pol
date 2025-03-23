const assert = require("node:assert");
const { test, describe, beforeEach } = require("node:test");
const supertest = require("supertest");

const app = require("../src/app");
const productModel = require("../src/models/products");
const db = require("../src/utils/db");

const api = supertest(app);

describe("Products API", () => {
    beforeEach(async () => {
        db.serialize(() => {
            db.run("DELETE FROM products");
        });
    });

    test("should create a product successfully", async () => {
        const newProduct = {
            name: "Test Product",
            shopId: 1,
            description: "A sample product for testing",
            price: 19.99,
            size: "M",
        };

        const response = await api
            .post("/api/products")
            .send(newProduct)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        assert(response.body.id, "Product ID should be returned");
        assert.strictEqual(response.body.name, newProduct.name);
        assert.strictEqual(response.body.price, newProduct.price);
        assert.strictEqual(response.body.size, newProduct.size);

        const savedProduct = await productModel.getProductById(response.body.id);
        assert(savedProduct, "Product should exist in the database");
        assert.strictEqual(savedProduct.name, newProduct.name);
    });

    test("should get all products", async () => {
        const newProduct = {
            name: "Test Product",
            shopId: 1,
            description: "A sample product for testing",
            price: 19.99,
            size: "M",
        };

        await api.post("/api/products").send(newProduct).expect(201);

        const response = await api
            .get("/api/products")
            .expect(200)
            .expect("Content-Type", /application\/json/);

        assert(Array.isArray(response.body), "Response should be an array");
        assert(response.body.length > 0, "There should be at least one product");
    });

});