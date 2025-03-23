const db = require("../utils/db");

// Asociar una categoría con una tienda
const addCategoryToShop = (shopId, categoryType) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO shop_categories (shopId, type) VALUES (?, ?)";

        db.run(sql, [shopId, categoryType], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    shopId,
                    categoryType,
                });
            }
        });
    });
};

// Obtener todas las categorías de una tienda
const getCategoriesByShopId = (shopId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM shop_categories WHERE shopId = ?";
        db.all(sql, [shopId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// Eliminar una categoría de una tienda
const removeCategoryFromShop = (shopId, categoryType) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM shop_categories WHERE shopId = ? AND type = ?";

        db.run(sql, [shopId, categoryType], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({});
            }
        });
    });
};

// shopCategoriesModel.js
const deleteCategoriesByShopId = (shopId) => {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM shop_categories WHERE shopId = ?";
      db.run(sql, [shopId], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);  // Devuelve el número de filas eliminadas
        }
      });
    });
  };
  

module.exports = { addCategoryToShop, getCategoriesByShopId, removeCategoryFromShop, deleteCategoriesByShopId };
