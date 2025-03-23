const db = require("../utils/db")
const productsModel = require("./products")
const usersModel = require("./users")
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
            passwordHash TEXT NOT NULL,
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
 
 
        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY,
            shopId INTEGER NOT NULL,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            price REAL NOT NULL,
            size TEXT,
            FOREIGN KEY(shopId) REFERENCES shops(id)
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
        
        db.run(`INSERT INTO users (name, username, passwordHash, email, role) VALUES
            ('Juan Pérez', 'juanp', 'hashedpassword1', 'juan@example.com', 'shopper'),
            ('María García', 'mariag', '$2b$10$ciczczK3smszgHB.cXUpfed8k.rHwZ5uPtOXPbml4J7AcT49CPioS', 'maria@example.com', 'salesperson'),
            ('Carlos López', 'admin', '$2b$10$ciczczK3smszgHB.cXUpfed8k.rHwZ5uPtOXPbml4J7AcT49CPioS', 'carlos@example.com', 'admin')
        `); // password: hashedpassword3
 
        // Shops
        db.run(`INSERT INTO shops (ownerId, name, description) VALUES
            (2, 'Tienda de María', 'Tienda de ropa y accesorios'),
            (3, 'ElectroCarlos', 'Venta de productos electrónicos')
        `);
 
        // Shop Categories
        db.run(`INSERT INTO shop_categories (shopId, type) VALUES
            (1, 'Ropa'),
            (1, 'Accesorios'),
            (2, 'Electrónica')
        `);
 
        // Products
        db.run(`INSERT INTO products (name, shopId, description, price, size) VALUES
            ('Camiseta Azul', 1, 'Camiseta de algodón color azul', 19.99, 'M'),
            ('Pantalón Negro', 1, 'Pantalón de mezclilla negro', 39.99, 'L'),
            ('Smartphone X', 2, 'Teléfono inteligente con 128GB de almacenamiento', 599.99, NULL)
        `);
 
        // Product Images
        db.run(`INSERT INTO product_images (productId, image) VALUES
            (1, 'camiseta_azul.jpg'),
            (2, 'pantalon_negro.jpg'),
            (3, 'smartphone_x.jpg')
        `);
 
        // Orders
        db.run(`INSERT INTO orders (shopperId, shopId, address, status, totalPrice) VALUES
            (1, 1, 'Calle 123, Ciudad A', 'pending', 59.98),
            (1, 2, 'Av. 456, Ciudad B', 'shipped', 599.99)
        `);
 
        // Order List Products
        db.run(`INSERT INTO order_list_products (orderId, productId, quantity, totalProductPrice) VALUES
            (1, 1, 1, 19.99),
            (1, 2, 1, 39.99),
            (2, 3, 1, 599.99)
        `);
 
        console.log("Sample data inserted successfully.");
    })
}
 
module.exports = {
    initDb, productsModel, usersModel, shopsModel, ordersModel, orderListProductsModel, productImagesModel, shopCategoriesModel
}