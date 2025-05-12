# Endpoints de la API de Products

## POST `/api/products`

**Descripción:**  
Crea un nuevo producto dentro de una tienda.

**Recibe:**  
JSON con los campos:  
`shopId`, `name`, `description` *(opcional)*, `price`, `size`.

**Autenticación:**  
Requiere token de usuario con rol `salesperson`.  
Solo se permite si el usuario es dueño (`ownerId`) de la tienda.

**Retorna:**
- `201` – Producto creado correctamente.
- `400` – Faltan campos obligatorios.
- `403` – El usuario no tiene permiso para crear productos en esa tienda.
- `500` – Error interno al crear el producto.

---

## GET `/api/products`

**Descripción:**  
Obtiene todos los productos registrados, incluyendo sus imágenes.

**Recibe:**  
Nada.

**Autenticación:**  
No requiere autenticación.

**Retorna:**
- `200` – Array de productos.
- `500` – Error al obtener los productos.

---

## GET `/api/products/:id`

**Descripción:**  
Obtiene un producto específico por su ID, incluyendo sus imágenes.

**Recibe:**  
Parámetro `:id` en la URL.

**Autenticación:**  
No requiere autenticación.

**Retorna:**
- `200` – Objeto producto con imágenes.
- `404` – Producto no encontrado.
- `500` – Error al obtener el producto.

---

## PUT `/api/products/:id`

**Descripción:**  
Actualiza un producto existente.

**Recibe:**  
Parámetro `:id` en la URL y JSON con campos actualizables:  
`shopId`, `name`, `description`, `price`, `size`.

**Autenticación:**  
Requiere token de usuario con rol `salesperson`.  
Solo se permite si el usuario es dueño de la tienda donde está el producto.

**Retorna:**
- `200` – Producto actualizado correctamente.
- `403` – El usuario no tiene permiso para actualizar productos en esa tienda.
- `500` – Error al actualizar el producto.

---

## DELETE `/api/products/:id`

**Descripción:**  
Elimina un producto específico por su ID, junto con sus imágenes asociadas.

**Recibe:**  
Parámetro `:id` en la URL.

**Autenticación:**  
Requiere token con rol `salesperson`.  
Solo se permite si el usuario es dueño de la tienda del producto.

**Retorna:**
- `200` – Producto eliminado correctamente.
- `403` – El usuario no tiene permiso para eliminar productos en esa tienda.
- `404` – Producto no encontrado.
- `500` – Error al eliminar el producto.

---

# Endpoints de Imágenes de Productos

## POST `/api/products/:productId/images`

**Descripción:**  
Agrega una imagen a un producto.

**Recibe:**  
Parámetro `:productId` en la URL.  
JSON con campo:  
`imageUrl`.

**Autenticación:**  
Requiere token con rol `salesperson`.  
Solo se permite si el usuario es dueño del producto.

**Retorna:**
- `201` – Imagen agregada correctamente.
- `403` – El usuario no tiene permiso para modificar este producto.
- `500` – Error al agregar la imagen.

---

## DELETE `/api/products/:productId/images/:imageId`

**Descripción:**  
Elimina una imagen específica de un producto.

**Recibe:**  
Parámetros `:productId` y `:imageId` en la URL.

**Autenticación:**  
Requiere token con rol `salesperson`.  
Solo se permite si el usuario es dueño del producto.

**Retorna:**
- `200` – Imagen eliminada correctamente.
- `403` – El usuario no tiene permiso para eliminar esta imagen.
- `404` – Imagen o producto no encontrados.
- `500` – Error al eliminar la imagen.
