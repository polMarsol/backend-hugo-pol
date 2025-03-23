const db = require("../utils/db");
const productImagesModel = require("./productImages"); // Importamos el modelo de imágenes
 
// Crear un producto
const createProduct = (product) => {
    return new Promise((resolve, reject) => {
        const { name, shopId, description, price, size } = product;
        const sql = "INSERT INTO products (name, shopId, description, price, size) VALUES (?, ?, ?, ?, ?)";
 
        db.run(sql, [name, shopId, description, price, size], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    id: this.lastID,
                    name,
                    shopId,
                    description,
                    price,
                    size
                });
            }
        });
    });
};
 
// Obtener todos los productos con imágenes
const getAllProducts = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM products", [], async (err, rows) => {
            if (err) {
                reject(err);
            } else {
                // Agregamos las imágenes a cada producto
                const productsWithImages = await Promise.all(
                    rows.map(async (product) => {
                        const images = await productImagesModel.getProductImagesByProductId(product.id);
                        return {
                            ...product,
                            images,
                        };
                    })
                );
                resolve(productsWithImages);
            }
        });
    });
};
 
// Obtener un producto por su ID con imágenes
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
                    const images = await productImagesModel.getProductImagesByProductId(row.id);
                    resolve({
                        ...row,
                        images,
                    });
                } catch (imageError) {
                    reject(imageError);
                }
            }
        });
    });
};
 
// Actualizar un producto
const updateProduct = (id, product) => {
    return new Promise((resolve, reject) => {
        const { name, shopId, description, price, size } = product;
        const sql = "UPDATE products SET name = ?, shopId = ?, description = ?, price = ?, size = ? WHERE id = ?";
 
        db.run(sql, [name, shopId, description, price, size, id], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    id,
                    name,
                    shopId,
                    description,
                    price,
                    size
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
            } else {
                resolve(this.changes);
            }
        });
    });
};
 
module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProductById };