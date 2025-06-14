const db = require("../utils/db")
const productsModel = require("./products")
const usersModel = require("./users")
const shopsModel = require("./shops")
const ordersModel = require("./orders")
const orderListProductsModel = require("./orderListProducts")
const productImagesModel = require("./productImages")
const shopCategoriesModel = require("./shopCategories")
const bcrypt = require('bcrypt');
 
 
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

        // Contraseñas que quieres encriptar
        const passwords = ['1234', '1234', 'admin1234'];

        // Encriptar las contraseñas
        Promise.all(passwords.map(password => bcrypt.hash(password, 10)))
        .then((hashedPasswords) => {
            // Una vez que se hayan encriptado las contraseñas, puedes insertar los datos en la base de datos
            const query = `
            INSERT INTO users (name, username, password, email, role) VALUES
            ('Juan Pérez', 'juanp', '${hashedPasswords[0]}', 'juan@example.com', 'shopper'),
            ('María García', 'mariag', '${hashedPasswords[1]}', 'maria@example.com', 'salesperson'),
            ('Carlos López', 'admin', '${hashedPasswords[2]}', 'carlos@example.com', 'admin')
            `;
            db.run(query);
        })
        .catch((err) => {
            console.error('Error en la encriptación de contraseñas:', err);
        });


 
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
            ('Camiseta Blanca', 1, 'Camiseta de algodón color blanco', 19.99, 'M'),
            ('Pantalón Negro', 1, 'Pantalón de mezclilla negro', 39.99, 'L'),
            ('Smartphone X', 2, 'Teléfono inteligente con 128GB de almacenamiento', 599.99, NULL),
            ('Hugo', 1, 'Calvicie extrema, buena calva para reflejarse como en un espejo', 9.99, 'XXL')

        `);
 
        // Product Images
        db.run(`INSERT INTO product_images (productId, image) VALUES
            (1, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
            (2, 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGJsYWNrJTIwcGFudHxlbnwwfHwwfHx8MA%3D%3D'),
            (3, 'https://images.unsplash.com/photo-1515054562254-30a1b0ebe227?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aXBob25lJTIweHxlbnwwfHwwfHx8MA%3D%3D'),
            (4, 'https://images.unsplash.com/photo-1738486226945-ef310003c9b2?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGJhbGR8ZW58MHx8MHx8fDA%3D')

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