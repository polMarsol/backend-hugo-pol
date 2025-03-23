const db = require("../utils/db");

// Crear una descripción de producto
const createProductDescription = (description) => {
    return new Promise((resolve, reject) => {
        const { productName, descriptionText, price, size } = description;
        const sql = "INSERT INTO product_descriptions (productName, description, price, size) VALUES (?, ?, ?, ?)";

        db.run(sql, [productName, descriptionText, price, size], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    id: this.lastID,
                    productName,
                    descriptionText,
                    price,
                    size,
                });
            }
        });
    });
};

// Obtener todas las descripciones de productos
const getAllProductDescriptions = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM product_descriptions", [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// Obtener una descripción de producto por ID
const getProductDescriptionById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM product_descriptions WHERE id = ?";
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            } else if (!row) {
                resolve(null);
            } else {
                resolve(row);
            }
        });
    });
};

// Actualizar una descripción de producto
const updateProductDescription = (id, description) => {
    return new Promise((resolve, reject) => {
        const { productName, descriptionText, price, size } = description;
        const sql = "UPDATE product_descriptions SET productName = ?, description = ?, price = ?, size = ? WHERE id = ?";

        db.run(sql, [productName, descriptionText, price, size, id], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    id,
                    productName,
                    descriptionText,
                    price,
                    size,
                });
            }
        });
    });
};

// Eliminar una descripción de producto por ID
const deleteProductDescriptionById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM product_descriptions WHERE id = ?";
        db.run(sql, [id], function (err) {
            if (err) {
                reject(err);
            } else if (this.changes === 0) {
                reject(new Error('Product description not found'));
            } else {
                resolve();
            }
        });
    });
};

module.exports = { createProductDescription, getAllProductDescriptions, getProductDescriptionById, updateProductDescription, deleteProductDescriptionById };
