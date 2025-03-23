const db = require("../utils/db");
 
// Agregar una imagen a un producto
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
 
// Obtener todas las imágenes de un producto
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
 
// Eliminar todas las imágenes de un producto por ID de producto
const deleteProductImagesByProductId = (productId) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM product_images WHERE productId = ?";
        db.run(sql, [productId], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};
 
module.exports = { addProductImage, getProductImagesByProductId, deleteProductImagesByProductId };