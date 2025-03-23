const express = require('express');
//const shopsModel = require('../models/shopsModel');
//const shopCategoriesModel = require('../models/shopCategoriesModel');
const { shopsModel, shopCategoriesModel } = require('../models');


const shopsRouter = express.Router();

// Crear una tienda
shopsRouter.post('/', async (req, res) => {
  const { ownerId, name, description } = req.body;

  if (!ownerId || !name) {
    return res.status(400).json({ error: 'El dueño y el nombre de la tienda son obligatorios' });
  }

  try {
    const newShop = await shopsModel.createShop({ ownerId, name, description });
    res.status(201).json(newShop);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la tienda' });
  }
});

// Obtener todas las tiendas
shopsRouter.get('/', async (req, res) => {
  try {
    const shops = await shopsModel.getAllShops();
    res.json(shops);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las tiendas' });
  }
});

// Obtener una tienda por su ID
shopsRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const shop = await shopsModel.getShopById(id);
    if (!shop) {
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }
    const categories = await shopCategoriesModel.getCategoriesByShopId(id); // Obtener las categorías de la tienda
    shop.categories = categories; // Añadir las categorías al objeto tienda
    res.json(shop);
  } catch (error) {
    console.error(error);  // Log para ver más detalles del error
    res.status(500).json({ error: 'Error al obtener la tienda' });
  }
});


// Actualizar una tienda
shopsRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { ownerId, name, description } = req.body;

  try {
    const updatedShop = await shopsModel.updateShop(id, { ownerId, name, description });
    res.status(200).json(updatedShop);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la tienda' });
  }
});

// Eliminar una tienda
shopsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const shop = await shopsModel.getShopById(id);
    if (!shop) {
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }

    await shopsModel.deleteShopById(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la tienda' });
  }
});

// Añadir una categoría a una tienda
shopsRouter.post('/:id/categories', async (req, res) => {
  const { id } = req.params;
  const { categoryType } = req.body;

  if (!categoryType) {
    return res.status(400).json({ error: 'El tipo de categoría es obligatorio' });
  }

  try {
    const shop = await shopsModel.getShopById(id);
    if (!shop) {
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }

    await shopCategoriesModel.addCategoryToShop(id, categoryType);
    res.status(201).json({ message: 'Categoría añadida a la tienda' });
  } catch (error) {
    res.status(500).json({ error: 'Error al añadir la categoría a la tienda' });
  }
});

// Eliminar una categoría de una tienda
shopsRouter.delete('/:shopId/categories/:categoryType', async (req, res) => {
  const { shopId, categoryType } = req.params;

  try {
    const shop = await shopsModel.getShopById(shopId);
    if (!shop) {
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }

    await shopCategoriesModel.removeCategoryFromShop(shopId, categoryType);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la categoría de la tienda' });
  }
});

module.exports = shopsRouter;
