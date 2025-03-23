const express = require('express');
const { shopsModel, shopCategoriesModel } = require('../models');
const { checkAdmin } = require('../utils/middleware');


const shopsRouter = express.Router();

// Crear una tienda
shopsRouter.post('/', checkAdmin, async (req, res) => { // Añadimos el middleware checkAdmin aquí
  const { ownerId, name, description } = req.body;

  if (!ownerId || !name) {
    return res.status(400).json({ error: 'El dueño (ownerId) y el nombre de la tienda son obligatorios' });
  }

  try {
    // Verificamos si el ownerId existe y si tiene el rol de salesperson
    const owner = await usersModel.getUserById(ownerId);

    if (!owner) {
      return res.status(404).json({ error: 'El usuario dueño (ownerId) no existe' });
    }

    if (owner.role !== 'salesperson') {
      return res.status(400).json({ error: 'El usuario dueño no tiene el rol de vendedor (salesperson)' });
    }

    // Si es un salesperson, crear la tienda
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

// Eliminar una tienda y sus categorías asociadas
shopsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Primero, eliminar las categorías asociadas a la tienda
    const categoriesDeleted = await shopCategoriesModel.deleteCategoriesByShopId(id);
    if (categoriesDeleted === 0) {
      console.log('No se encontraron categorías para eliminar.');
    }

    // Luego, eliminar la tienda
    const shop = await shopsModel.getShopById(id);
    if (!shop) {
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }

    await shopsModel.deleteShopById(id);
    res.status(204).end();  // Responder con No Content si todo fue exitoso
  } catch (error) {
    console.error('Error al eliminar tienda:', error);
    res.status(500).json({ error: 'Error al eliminar la tienda y sus categorías' });
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

// Obtener las categorías de una tienda
shopsRouter.get('/:id/categories', async (req, res) => {
  const { id } = req.params;

  try {
    // Obtener la tienda por su ID
    const shop = await shopsModel.getShopById(id);
    if (!shop) {
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }

    // Obtener las categorías de la tienda
    const categories = await shopCategoriesModel.getCategoriesByShopId(id);

    // Devolver las categorías de la tienda
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las categorías de la tienda' });
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
