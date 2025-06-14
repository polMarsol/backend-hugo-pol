const express = require('express');
const orderModel = require('../models/orders');
const ordersRouter = express.Router();
const { verifyToken, verifyRole } = require('../utils/middleware');
const { orderListProductsModel, shopsModel } = require('../models');

// Crear un pedido
ordersRouter.post('/', verifyToken, verifyRole(['shopper']) ,async (req, res) => {
  const { shopperId, shopId, address, status, totalPrice, products } = req.body;

  if (!shopperId || !shopId || !address || !status || !totalPrice || !products || !Array.isArray(products)) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios, incluyendo los productos' });
  }

  try {
    const newOrder = await orderModel.createOrder({ shopperId, shopId, address, status, totalPrice });

    const productPromises = products.map(p =>
      orderListProductsModel.addProductToOrder({
        orderId: newOrder.id,
        productId: p.productId,
        quantity: p.quantity,
        totalProductPrice: p.totalProductPrice
      })
    )
    await Promise.all(productPromises)
    const createdOrder = await orderModel.getOrderById(newOrder.id);
    
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el pedido' });
  }
});

// Obtener todos los pedidos
// Obtener todos los pedidos
ordersRouter.get('/', verifyToken, verifyRole(['shopper', 'salesperson']), async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'shopper') {
      orders = await orderModel.getOrdersByShopperId(req.user.id);
    } else if (req.user.role === 'salesperson') {
      const shopIds = await orderModel.getShopIdsByOwnerId(req.user.id);
      orders = await orderModel.getOrdersByShopIds(shopIds);
    }

    // Añadir detalles: nombre de tienda y productos
    const detailedOrders = await Promise.all(
      orders.map(async (order) => {
        const shop = await shopsModel.getShopById(order.shopId); 
        const products = await orderListProductsModel.getProductsByOrderId(order.id);
        return {
          ...order,
          shopName: shop?.name || 'Tienda desconocida',
          products: products || []
        };
      })
    );

    res.json(detailedOrders); // Enviar pedidos con info añadida
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
});


// Obtener un pedido por ID
ordersRouter.get('/:id', verifyToken, verifyRole(['shopper', 'salesperson']), async (req, res) => {
  const { id } = req.params;
  const order = await orderModel.getOrderById(id);
  if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
  }
  const shop = await shopsModel.getShopById(order.shopId)
  const ownerId = shop.ownerId
  try {
    if(req.user.id !== order.shopperId && req.user.id !== ownerId) {
      return res.status(403).json({ error: 'No tienes permiso para ver este pedido' });
    }  
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el pedido' });
  }
});

// Actualizar un pedido
ordersRouter.put('/:id', verifyToken, verifyRole(['salesperson']) ,async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'El estado es obligatorio' });
  }

  const order = await orderModel.getOrderById(id)
  const shopId = order.shopId
  const shop = await shopsModel.getShopById(shopId)
  const ownerId = shop.ownerId

  if (req.user.id == ownerId) {
    try {
        const updatedOrder = await orderModel.updateOrder(id, { status });
        res.status(200).json(updatedOrder);
      } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el pedido' });
      }
  } else {
      return response.status(403).json({ error: "No tienes permiso modificar esta order" });
  }
});

// Eliminar un pedido
ordersRouter.delete('/:id', verifyToken, verifyRole(['salesperson']), async (req, res) => {
  const { id } = req.params;

  const order = await orderModel.getOrderById(id)
  const shopId = order.shopId
  const shop = await shopsModel.getShopById(shopId)
  const ownerId = shop.ownerId
  if(req.user.id === ownerId) {
     try {
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
  } else {
    return res.status(403).json({ error: "No tienes permiso para eliminar este pedido" });
  }
});


module.exports = ordersRouter;
