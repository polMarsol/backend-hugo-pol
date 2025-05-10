const express = require("express");
const router = express.Router();
const productModel = require("../models/products");
const productImagesModel = require("../models/productImages");
const { verifyToken, verifyRole } = require('../utils/middleware');
const { usersModel, shopsModel } = require("../models");

// Crear un producto
router.post("/",verifyToken, verifyRole(['salesperson']),async (req, res) => {
    const { name, shopId, description, price, size } = req.body;

    const id = req.user.id;

    const infoShop = await shopsModel.getShopById(shopId)

    const ownerId = infoShop.ownerId

    if (id === ownerId) {
        if (!name || !shopId || !price) {
                return res.status(400).json({ error: "Faltan campos obligatorios." });
            }
            
            try {
                const newProduct = await productModel.createProduct(req.body);
                res.status(201).json(newProduct);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
    } else {
        return res.status(403).json({ error: 'No tienes permisos para crear en esta tienda' });
    }
});

// Obtener todos los productos con sus imágenes
router.get("/", async (req, res) => {
    try {
        const products = await productModel.getAllProducts();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener un producto por ID con sus imágenes
router.get("/:id", async (req, res) => {
    try {
        const product = await productModel.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar un producto
router.put("/:id", verifyToken, verifyRole(['salesperson']) ,async (req, res) => {
    try {
        const updatedProduct = await productModel.updateProduct(req.params.id, req.body);
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar un producto por ID
router.delete("/:id", verifyToken, verifyRole(['salesperson']) ,async (req, res) => {
    try {
        await productImagesModel.deleteProductImagesByProductId(req.params.id);
        const deletedRows = await productModel.deleteProductById(req.params.id);
 
        if (deletedRows === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Agregar una imagen a un producto
router.post("/:productId/images", async (req, res) => {
    try {
        const newImage = await productImagesModel.addProductImage({
            productId: req.params.productId,
            imageUrl: req.body.imageUrl
        });
        res.status(201).json(newImage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener todas las imágenes de un producto
router.get("/:productId/images", async (req, res) => {
    try {
        const images = await productImagesModel.getProductImagesByProductId(req.params.productId);
        res.status(200).json(images);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar todas las imágenes de un producto
router.delete("/:productId/images", async (req, res) => {
    try {
        await productImagesModel.deleteProductImagesByProductId(req.params.productId);
        res.status(200).json({ message: "Imagenes de producto correctamente eliminadas" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
