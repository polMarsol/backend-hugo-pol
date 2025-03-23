const db = require("../utils/db");
const productDescriptionsModel = require("./productDescriptions"); // Importamos el modelo de productDescriptions

// Crear un producto
const createProduct = (product) => {
    return new Promise((resolve, reject) => {
        const { name, shopId, productDescriptionId } = product;
        const sql = "INSERT INTO products (name, shopId, productDescriptionId) VALUES (?, ?, ?)";

        db.run(sql, [name, shopId, productDescriptionId], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    id: this.lastID,
                    name,
                    shopId,
                    productDescriptionId,
                });
            }
        });
    });
};

// Obtener todos los productos
const getAllProducts = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM products", [], async (err, rows) => {
            if (err) {
                reject(err);
            } else {
                // Agregamos las descripciones de los productos a cada producto
                const productsWithDescriptions = await Promise.all(
                    rows.map(async (product) => {
                        const description = await productDescriptionsModel.getProductDescriptionById(product.productDescriptionId);
                        return {
                            ...product,
                            description,
                        };
                    })
                );
                resolve(productsWithDescriptions);
            }
        });
    });
};

// Obtener un producto por ID
const getProductById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM products WHERE id = ?";
        db.get(sql, [id], async (err, row) => {
            if (err) {
                reject(err);
            } else if (!row) {
                resolve(null);
            } else {
                try {
                    const description = await productDescriptionsModel.getProductDescriptionById(row.productDescriptionId);
                    resolve({
                        ...row,
                        description,
                    });
                } catch (descriptionError) {
                    reject(descriptionError); // Si ocurre un error al obtener la descripción, lo rechazamos
                }
            }
        });
    });
};

// Actualizar un producto
const updateProduct = (id, product) => {
    return new Promise((resolve, reject) => {
        const { name, shopId, productDescriptionId } = product;
        const sql = "UPDATE products SET name = ?, shopId = ?, productDescriptionId = ? WHERE id = ?";

        db.run(sql, [name, shopId, productDescriptionId, id], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    id,
                    name,
                    shopId,
                    productDescriptionId,
                });
            }
        });
    });
};

// Eliminar un producto por ID
const deleteProductById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM products WHERE id = ?";
        db.run(sql, [id], function (err) {
            if (err) {
                reject(err);
            } else if (this.changes === 0) {
                reject(new Error('Product not found'));
            } else {
                resolve();
            }
        });
    });
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProductById };
