# Endpoints de la API de Pedidos

## POST `/api/order`

**Descripción:**  
Crea un nuevo pedido con productos asociados.

**Recibe:**  
JSON con los campos:  
- `shopperId`: ID del comprador.  
- `shopId`: ID de la tienda.  
- `address`: Dirección de entrega.  
- `status`: Estado inicial del pedido (`pending`, etc).  
- `totalPrice`: Precio total del pedido.  
- `products`: Array de productos con:  
  - `productId`,  
  - `quantity`,  
  - `totalProductPrice`.

**Autenticación:**  
Requiere token con rol `shopper`.

**Retorna:**
- `201` – Pedido creado correctamente con sus productos.  
- `400` – Faltan campos obligatorios.  
- `500` – Error interno al crear el pedido.

---

## GET `/api/order`

**Descripción:**  
Obtiene todos los pedidos del usuario autenticado.  
- Si el usuario es `shopper`: pedidos hechos por él.  
- Si el usuario es `salesperson`: pedidos de las tiendas que gestiona.

**Recibe:**  
Nada.

**Autenticación:**  
Requiere token con rol `shopper` o `salesperson`.

**Retorna:**
- `200` – Array de pedidos.  
- `500` – Error al obtener los pedidos.

---

## GET `/api/order/:id`

**Descripción:**  
Obtiene un pedido específico por su ID.

**Recibe:**  
Parámetro `:id` en la URL.

**Autenticación:**  
Requiere token con rol `shopper` o `salesperson`.  
- Solo el comprador o el dueño de la tienda puede acceder.

**Retorna:**
- `200` – Objeto con datos del pedido.  
- `403` – El usuario no tiene permiso para ver el pedido.  
- `404` – Pedido no encontrado.  
- `500` – Error al obtener el pedido.

---

## PUT `/api/order/:id`

**Descripción:**  
Actualiza el estado de un pedido.

**Recibe:**  
Parámetro `:id` en la URL.  
JSON con campo:  
- `status`: Nuevo estado del pedido.

**Autenticación:**  
Requiere token con rol `salesperson`.  
Solo se permite si el usuario es dueño de la tienda del pedido.

**Retorna:**
- `200` – Pedido actualizado correctamente.  
- `400` – Faltan campos obligatorios.  
- `403` – El usuario no tiene permiso para modificar el pedido.  
- `500` – Error al actualizar el pedido.

---

## DELETE `/api/order/:id`

**Descripción:**  
Elimina un pedido específico y sus productos asociados.

**Recibe:**  
Parámetro `:id` en la URL.

**Autenticación:**  
Requiere token con rol `salesperson`.  
Solo se permite si el usuario es dueño de la tienda del pedido.

**Retorna:**
- `204` – Pedido eliminado correctamente.  
- `403` – El usuario no tiene permiso para eliminar el pedido.  
- `404` – Pedido no encontrado.  
- `500` – Error al eliminar el pedido.
