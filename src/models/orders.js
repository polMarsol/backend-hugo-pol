const db = require("../utils/db");
const orderListProductsModel = require("./orderListProducts");


// Crear un pedido
const createOrder = ({ shopperId, shopId, address, status, totalPrice }) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO orders (shopperId, shopId, address, status, totalPrice) VALUES (?, ?, ?, ?, ?)`;

        db.run(sql, [shopperId, shopId, address, status, totalPrice], function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, shopperId, shopId, address, status, totalPrice });
        });
    });
};

// Obtener todos los pedidos
const getAllOrders = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM orders", [], async (err, rows) => {
            if (err) {
                reject(err);
            } else {
                // Agregar productos a cada pedido
                const ordersWithProducts = await Promise.all(
                    rows.map(async (order) => {
                        const products = await orderListProductsModel.getProductsByOrderId(order.id);
                        return {
                            ...order,
                            products,
                        };
                    })
                );
                resolve(ordersWithProducts);
            }
        });
    });
};

// Obtener un pedido por ID con sus productos asociados
const getOrderById = (id) => {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM orders WHERE id = ?", [id], async (err, row) => {
            if (err) {
                reject(err);
            } else if (!row) {
                resolve(null);
            } else {
                // Obtener los productos del pedido
                const products = await orderListProductsModel.getProductsByOrderId(id);
                resolve({
                    ...row,
                    products,
                });
            }
        });
    });
};

// Actualizar un pedido (solo dirección y estado pueden cambiar)
const updateOrder = (id, { address, status }) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE orders SET address = ?, status = ? WHERE id = ?";

        db.run(sql, [address, status, id], function (err) {
            if (err) reject(err);
            else resolve({ id, address, status, message: "Order updated successfully" });
        });
    });
};

// Eliminar un pedido
const deleteOrderById = (id) => {
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM orders WHERE id = ?", [id], function (err) {
            if (err) reject(err);
            else resolve({ message: "Order deleted successfully" });
        });
    });
};

const deleteOrderProductsByOrderId = async (orderId) => {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM order_list_products WHERE orderId = ?';
      db.run(query, [orderId], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);  // Número de filas eliminadas
        }
      });
    });
};
  
module.exports = { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrderById, deleteOrderProductsByOrderId};