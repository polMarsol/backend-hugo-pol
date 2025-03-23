const db = require("../utils/db");

// Añadir un producto a un pedido
const addProductToOrder = ({ orderId, productId, quantity, totalProductPrice }) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO order_list_products (orderId, productId, quantity, totalProductPrice) VALUES (?, ?, ?, ?)`;

        db.run(sql, [orderId, productId, quantity, totalProductPrice], function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, orderId, productId, quantity, totalProductPrice });
        });
    });
};

// Obtener todos los productos de un pedido
const getProductsByOrderId = (orderId) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM order_list_products WHERE orderId = ?`;
        db.all(sql, [orderId], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// Actualizar la cantidad de un producto en un pedido
const updateProductInOrder = (orderId, productId, quantity, totalProductPrice) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE order_list_products SET quantity = ?, totalProductPrice = ? WHERE orderId = ? AND productId = ?`;

        db.run(sql, [quantity, totalProductPrice, orderId, productId], function (err) {
            if (err) reject(err);
            else resolve({ orderId, productId, quantity, totalProductPrice, message: "Order item updated successfully" });
        });
    });
};

// Eliminar un producto de un pedido
const removeProductFromOrder = (orderId, productId) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM order_list_products WHERE orderId = ? AND productId = ?`;

        db.run(sql, [orderId, productId], function (err) {
            if (err) reject(err);
            else resolve({ message: "Product removed from order" });
        });
    });
};

module.exports = { addProductToOrder, getProductsByOrderId, updateProductInOrder, removeProductFromOrder };