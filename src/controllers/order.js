const express = require('express');
const orderModel = require('../models/orders');
const ordersRouter = express.Router();
const { verifyToken, verifyRole } = require('../utils/middleware');

// Crear un pedido
ordersRouter.post('/', verifyToken, verifyRole(['shopper']) ,async (req, res) => {
  const { shopperId, shopId, address, status, totalPrice } = req.body;

  if (!shopperId || !shopId || !address || !status || !totalPrice) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const newOrder = await orderModel.createOrder({ shopperId, shopId, address, status, totalPrice });
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el pedido' });
  }
});

// Obtener todos los pedidos
ordersRouter.get('/', async (req, res) => {
  try {
    const orders = await orderModel.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
});

// Obtener un pedido por ID
ordersRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const order = await orderModel.getOrderById(id);
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el pedido' });
  }
});

// Actualizar un pedido
ordersRouter.put('/:id', verifyToken, verifyRole(['shopper']) ,async (req, res) => {
  const { id } = req.params;
  const { address, status } = req.body;

  if (!address || !status) {
    return res.status(400).json({ error: 'La dirección y el estado son obligatorios' });
  }

  try {
    const updatedOrder = await orderModel.updateOrder(id, { address, status });
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el pedido' });
  }
});

// Eliminar un pedido
ordersRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Primero verificamos si el pedido existe
    const order = await orderModel.getOrderById(id);
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Eliminamos los productos asociados a la orden
    await orderModel.deleteOrderProductsByOrderId(id);

    // Luego eliminamos el pedido
    await orderModel.deleteOrderById(id);
    
    res.status(204).end(); // Pedido eliminado correctamente
  } catch (error) {
    console.error(error);  // Log para ver más detalles del error
    res.status(500).json({ error: 'Error al eliminar el pedido' });
  }
});


module.exports = ordersRouter;
