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

// Actualizar un pedido (solo estado pueden cambiar)
const updateOrder = (id, {status }) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE orders SET status = ? WHERE id = ?";

        db.run(sql, [status, id], function (err) {
            if (err) reject(err);
            else resolve({ id, status, message: "Order updated successfully" });
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
  

const getOrdersByShopperId = (shopperId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM orders WHERE shopperId = ?";
        db.all(sql, [shopperId], async (err, rows) => {
            if (err) {
                reject(err);
            } else {
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
}



const getShopIdsByOwnerId = (ownerId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT id FROM shops WHERE ownerId = ?";
        db.all(sql, [ownerId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const shopIds = rows.map(row => row.id);
                resolve(shopIds);
            }
        });
    });
}



const getOrdersByShopIds = (shopIds) => {
    return new Promise((resolve, reject) => {
        if (shopIds.length === 0) return resolve([]);

        const placeholders = shopIds.map(() => '?').join(',');
        const sql = `SELECT * FROM orders WHERE shopId IN (${placeholders})`;

        db.all(sql, shopIds, async (err, rows) => {
            if (err) return reject(err);

            const ordersWithProducts = await Promise.all(
                rows.map(async (order) => {
                    const products = await orderListProductsModel.getProductsByOrderId(order.id);
                    return { ...order, products };
                })
            );

            resolve(ordersWithProducts);
        });
    });
};



module.exports = { 
    createOrder, 
    getAllOrders, 
    getOrderById, 
    updateOrder, 
    deleteOrderById, 
    deleteOrderProductsByOrderId, 
    getOrdersByShopperId, 
    getShopIdsByOwnerId, 
    getOrdersByShopIds
};