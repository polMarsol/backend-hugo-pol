
const bcrypt = require("bcrypt");
const assert = require("node:assert");
const { test, describe, beforeEach } = require("node:test");
const supertest = require("supertest");

const app = require("../src/app");
const orderModel = require("../src/models/orders");
const db = require("../src/utils/db");

const api = supertest(app);

describe("Orders API", () => {
    beforeEach(async () => {
        db.serialize(() => {
            db.run("DELETE FROM orders");
            db.run("DELETE FROM order_list_products");
        });
    });

    test("should create an order successfully", async () => {
        const newOrder = {
            shopperId: 1,
            shopId: 2,
            address: "123 Main St",
            status: "pending",
            totalPrice: 50.0,
            products: [
                { productId: 10, quantity: 2, totalProductPrice: 20.0 },
                { productId: 15, quantity: 1, totalProductPrice: 30.0 },
            ],
        };

        const response = await api
            .post("/api/order")
            .send(newOrder)
            .expect(201)
            .expect("Content-Type", /application\/json/);

        assert(response.body.id, "Order ID should be returned");
        assert.strictEqual(response.body.address, newOrder.address);
        assert.strictEqual(response.body.status, newOrder.status);
        assert.strictEqual(response.body.totalPrice, newOrder.totalPrice);

        const savedOrder = await orderModel.getOrderById(response.body.id);
        assert(savedOrder, "Order should exist in the database");
        assert.strictEqual(savedOrder.address, newOrder.address);
    });


    test("should get all orders", async () => {
        const newOrder = {
            shopperId: 1,
            shopId: 2,
            address: "123 Main St",
            status: "pending",
            totalPrice: 50.0,
            products: [
                { productId: 10, quantity: 2, totalProductPrice: 20.0 },
                { productId: 15, quantity: 1, totalProductPrice: 30.0 },
            ],
        };

        await api.post("/api/order").send(newOrder).expect(201);

        const response = await api
            .get("/api/order")
            .expect(200)
            .expect("Content-Type", /application\/json/);

        assert(Array.isArray(response.body), "Response should be an array");
        assert(response.body.length > 0, "There should be at least one order");
    });

    test("should get a specific order by ID", async () => {
        const newOrder = {
            shopperId: 1,
            shopId: 2,
            address: "123 Main St",
            status: "pending",
            totalPrice: 50.0,
            products: [
                { productId: 10, quantity: 2, totalProductPrice: 20.0 },
                { productId: 15, quantity: 1, totalProductPrice: 30.0 },
            ],
        };

        const createResponse = await api
            .post("/api/order")
            .send(newOrder)
            .expect(201);

        const orderId = createResponse.body.id;

        const response = await api
            .get(`/api/order/${orderId}`)
            .expect(200)
            .expect("Content-Type", /application\/json/);

        assert.strictEqual(response.body.id, orderId, "Order ID should match");
        assert.strictEqual(response.body.address, newOrder.address);
    });

    test("should update an order", async () => {
        const newOrder = {
            shopperId: 1,
            shopId: 2,
            address: "123 Main St",
            status: "pending",
            totalPrice: 50.0,
            products: [
                { productId: 10, quantity: 2, totalProductPrice: 20.0 },
                { productId: 15, quantity: 1, totalProductPrice: 30.0 },
            ],
        };

        const createResponse = await api
            .post("/api/order")
            .send(newOrder)
            .expect(201);

        const orderId = createResponse.body.id;

        const updatedOrder = {
            address: "456 Elm St",
            status: "shipped",
        };

        const response = await api
            .put(`/api/order/${orderId}`)
            .send(updatedOrder)
            .expect(200)
            .expect("Content-Type", /application\/json/);

        assert.strictEqual(response.body.address, updatedOrder.address);
        assert.strictEqual(response.body.status, updatedOrder.status);
    });

    test("should delete an order", async () => {
        const newOrder = {
            shopperId: 1,
            shopId: 2,
            address: "123 Main St",
            status: "pending",
            totalPrice: 50.0,
            products: [
                { productId: 10, quantity: 2, totalProductPrice: 20.0 },
                { productId: 15, quantity: 1, totalProductPrice: 30.0 },
            ],
        };

        const createResponse = await api
            .post("/api/order")
            .send(newOrder)
            .expect(201);

        const orderId = createResponse.body.id;

        await api
            .delete(`/api/order/${orderId}`)
            .expect(204);

        const response = await api
            .get(`/api/order/${orderId}`)
            .expect(404)
            .expect("Content-Type", /application\/json/);

        assert.strictEqual(response.body.error, "Pedido no encontrado");
    });

    test("should return error if no products are provided", async () => {
        const newOrder = {
            shopperId: 1,
            shopId: 2,
            address: "123 Main St",
            status: "pending",
            totalPrice: 50.0,
            products: [],
        };

        const response = await api
            .post("/api/order")
            .send(newOrder)
            .expect(400)
            .expect("Content-Type", /application\/json/);

        assert.strictEqual(response.body.error, "Todos los campos son obligatorios, incluyendo al menos un producto");
    });

});
