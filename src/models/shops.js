const db = require("../utils/db");
const shopCategoriesModel = require("./shopCategories"); // Importamos el modelo de categorías

// Crear una tienda
const createShop = (shop) => {
    return new Promise((resolve, reject) => {
        const { ownerId, name, description } = shop;
        const sql = "INSERT INTO shops (ownerId, name, description) VALUES (?, ?, ?)";

        db.run(sql, [ownerId, name, description], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    id: this.lastID,
                    ownerId,
                    name,
                    description,
                });
            }
        });
    });
};

// Obtener todas las tiendas
const getAllShops = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM shops", [], async (err, rows) => {
            if (err) {
                reject(err);
            } else {
                // Agregamos las categorías a cada tienda
                const shopsWithCategories = await Promise.all(
                    rows.map(async (shop) => {
                        const categories = await shopCategoriesModel.getCategoriesByShopId(shop.id);
                        return {
                            ...shop,
                            categories,
                        };
                    })
                );
                resolve(shopsWithCategories);
            }
        });
    });
};

const getShopById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM shops WHERE id = ?";
        db.get(sql, [id], async (err, row) => {
            if (err) {
                reject(err); // Si hay un error con la consulta SQL, lo rechazamos
            } else if (!row) {
                // Si no se encuentra la tienda, devolvemos null
                resolve(null); // Cambio de reject a resolve con null
            } else {
                try {
                    // Si se encuentra la tienda, obtener las categorías de manera segura
                    const categories = await shopCategoriesModel.getCategoriesByShopId(row.id);
                    resolve({
                        ...row,
                        categories,
                    });
                } catch (categoryError) {
                    reject(categoryError); // Si ocurre un error al obtener las categorías, lo rechazamos
                }
            }
        });
    });
};



// Actualizar una tienda
const updateShop = (id, shop) => {
    return new Promise((resolve, reject) => {
        const { ownerId, name, description } = shop;
        const sql = "UPDATE shops SET ownerId = ?, name = ?, description = ? WHERE id = ?";

        db.run(sql, [ownerId, name, description, id], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    id,
                    ownerId,
                    name,
                    description,
                });
            }
        });
    });
};

// Eliminar una tienda por ID
const deleteShopById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM shops WHERE id = ?";
        db.run(sql, [id], function (err) {
            if (err) {
                reject(err);
            } else if (this.changes === 0) {
                reject(new Error('Shop not found'));
            } else {
                resolve();
            }
        });
    });
};


module.exports = { createShop, getAllShops, getShopById, updateShop, deleteShopById };
