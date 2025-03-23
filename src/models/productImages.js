const db = require("../utils/db");

// Agregar una imagen de producto
const addProductImage = (image) => {
    return new Promise((resolve, reject) => {
        const { productId, imageUrl } = image;
        const sql = "INSERT INTO product_images (productId, image) VALUES (?, ?)";

        db.run(sql, [productId, imageUrl], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    id: this.lastID,
                    productId,
                    imageUrl,
                });
            }
        });
    });
};

// Obtener todas las imágenes de un producto por ID de producto
const getProductImagesByProductId = (productId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM product_images WHERE productId = ?";
        db.all(sql, [productId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// Eliminar una imagen de producto por ID
const deleteProductImageById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM product_images WHERE id = ?";
        db.run(sql, [id], function (err) {
            if (err) {
                reject(err);
            } else if (this.changes === 0) {
                reject(new Error('Product image not found'));
            } else {
                resolve();
            }
        });
    });
};

module.exports = { addProductImage, getProductImagesByProductId, deleteProductImageById };
