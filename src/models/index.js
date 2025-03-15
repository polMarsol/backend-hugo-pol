const db = require("../utils/db")
const productsModel = require("./products")
const usersModel = require("./users")
const productsDescriptionModel = require("./productsDescription")
const shopsModel = require("./shops")
const ordersModel = require("./orders")
const orderListProductsModel = require("./orderListProducts")
const productImagesModel = require("./productImages")
const shopCategoriesModel = require("./shopCategories")


// Database initialization
const initDb = () => {
    db.serialize(() => {
        // Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            role TEXT NOT NULL
        )`);

        // Shops table
        db.run(`CREATE TABLE IF NOT EXISTS shops (
            id INTEGER PRIMARY KEY,
            ownerId INTEGER NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            FOREIGN KEY(ownerId) REFERENCES users(id)
        )`);

        // ShopCategories table
        db.run(`CREATE TABLE IF NOT EXISTS shop_categories (
            shopId INTEGER NOT NULL,
            type TEXT NOT NULL,
            PRIMARY KEY (shopId, type),
            FOREIGN KEY(shopId) REFERENCES shops(id)
        )`);

        // Products table
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            shopId INTEGER NOT NULL,
            productDescriptionId INTEGER NOT NULL,
            FOREIGN KEY(shopId) REFERENCES shops(id),
            FOREIGN KEY(productDescriptionId) REFERENCES product_descriptions(id)
        )`);

        // ProductDescriptions table
        db.run(`CREATE TABLE IF NOT EXISTS product_descriptions (
            id INTEGER PRIMARY KEY,
            productName TEXT NOT NULL UNIQUE,
            description TEXT NOT NULL,
            price REAL NOT NULL,
            size TEXT
        )`);

        // ProductImages table
        db.run(`CREATE TABLE IF NOT EXISTS product_images (
            id INTEGER PRIMARY KEY,
            productId INTEGER NOT NULL,
            image TEXT NOT NULL,
            FOREIGN KEY(productId) REFERENCES products(id)
        )`);

        // Orders table
        db.run(`CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY,
            shopperId INTEGER NOT NULL,
            shopId INTEGER NOT NULL,
            address TEXT NOT NULL,
            status TEXT CHECK(status IN ('pending', 'shipped', 'delivered', 'cancelled')) NOT NULL,
            totalPrice REAL NOT NULL,
            FOREIGN KEY(shopperId) REFERENCES users(id),
            FOREIGN KEY(shopId) REFERENCES shops(id)
        )`);

        // OrderListProducts table
        db.run(`CREATE TABLE IF NOT EXISTS order_list_products (
            id INTEGER PRIMARY KEY,
            orderId INTEGER NOT NULL,
            productId INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            totalProductPrice REAL NOT NULL,
            FOREIGN KEY(orderId) REFERENCES orders(id),
            FOREIGN KEY(productId) REFERENCES products(id)
        )`);
    })
}

module.exports = {
    initDb, productsModel, usersModel, productsDescriptionModel, shopsModel, ordersModel, orderListProductsModel, productImagesModel, shopCategoriesModel
}