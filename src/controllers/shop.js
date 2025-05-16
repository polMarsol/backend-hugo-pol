const express = require('express');
const { shopsModel, shopCategoriesModel, usersModel } = require('../models');
const { verifyToken, verifyRole } = require('../utils/middleware');


const shopsRouter = express.Router();

// Crear una tienda
shopsRouter.post('/', verifyToken, verifyRole(['admin']), async (req, res) => {
  const { username, name, description } = req.body;

  if (!username || !name) {
    return res.status(400).json({ error: 'El dueño y el nombre de la tienda son obligatorios' });
  }

  try {
    // Verificamos si el ownerId existe y si tiene el rol de salesperson
    const owner = await usersModel.getUserByUsername(username);

    if (!owner) {
      return res.status(404).json({ error: 'El usuario dueño (ownerId) no existe' });
    }

    if (owner.role !== 'salesperson') {
      return res.status(400).json({ error: 'El usuario dueño no tiene el rol de vendedor (salesperson)' });
    }

    // Si es un salesperson, crear la tienda
    const newShop = await shopsModel.createShop({ ownerId: owner.id, name, description });
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
shopsRouter.put('/:id', verifyToken, verifyRole(['salesperson']), async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body

  const shop = await shopsModel.getShopById(id);
  if(!shop) {
    return res.status(404).json({ error: 'Tienda no encontrada' });
  }
  if(req.user.id === shop.ownerId) {
    try {
      const updatedShop = await shopsModel.updateShop(id, { ownerId: req.user.id, name, description });
      res.status(200).json(updatedShop);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la tienda' });
    }
  } else {
    return res.status(403).json({ error: 'No tienes permiso para actualizar esta tienda' });
  }
});

// Eliminar una tienda y sus categorías asociadas
shopsRouter.delete('/:id', verifyToken, verifyRole(['salesperson', 'admin']), async (req, res) => {
  const { id } = req.params;
  const shop = await shopsModel.getShopById(id);
  if (!shop) {
    return res.status(404).json({ error: 'Tienda no encontrada' });
  }
  if(shop.ownerId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'No tienes permiso para eliminar esta tienda' });
  }
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
shopsRouter.post('/:id/categories', verifyToken, verifyRole(['salesperson']), async (req, res) => {
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
shopsRouter.delete('/:shopId/categories/:categoryType', verifyToken, verifyRole(['salesperson', 'admin']), async (req, res) => {
  const { shopId, categoryType } = req.params;

  try {
    const shop = await shopsModel.getShopById(shopId);
    if (!shop) {
      return res.status(404).json({ error: 'Tienda no encontrada' });
    }

    if(shop.ownerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta tienda' });
    }

    await shopCategoriesModel.removeCategoryFromShop(shopId, categoryType);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la categoría de la tienda' });
  }
});

module.exports = shopsRouter;
