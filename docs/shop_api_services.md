# Endpoints de la API de Shops

## POST `/api/shops`

**Descripción:**  
Crea una nueva tienda, asignándole un `ownerId` que debe ser un usuario con rol `salesperson`.

**Recibe:**  
JSON con los campos:  
`ownerId`, `name`, `description` *(opcional)*.

**Autenticación:**  
Requiere token de usuario con rol `admin`.

**Retorna:**
- `201` – Tienda creada correctamente.
- `400` – Faltan campos o el owner no tiene el rol adecuado.
- `404` – El ownerId no existe.
- `500` – Error interno al crear la tienda.

---

## GET `/api/shops`

**Descripción:**  
Obtiene todas las tiendas registradas.

**Recibe:**  
Nada.

**Autenticación:**  
No requiere autenticación.

**Retorna:**
- `200` – Array de tiendas.
- `500` – Error al obtener las tiendas.

---

## GET `/api/shops/:id`

**Descripción:**  
Obtiene una tienda específica por su ID, incluyendo sus categorías.

**Recibe:**  
Parámetro `:id` en la URL.

**Retorna:**
- `200` – Objeto tienda con su información y categorías.
- `404` – Tienda no encontrada.
- `500` – Error al obtener la tienda.

---

## PUT `/api/shops/:id`

**Descripción:**  
Actualiza una tienda existente.

**Recibe:**  
Parámetro `:id` en la URL y JSON con campos:  
`ownerId`, `name`, `description`.

**Autenticación:**  
Requiere token de usuario con rol `salesperson`.

> ⚠️ **Nota:** No se verifica si el usuario es dueño de la tienda. 
Se valorará durante la implementación del Frontend si controlar este hecho ahi o en la lógica de Backend.

> ✅ DONE!

**Retorna:**
- `200` – Tienda actualizada correctamente.
- `500` – Error al actualizar la tienda.

---

## DELETE `/api/shops/:id`

**Descripción:**  
Elimina una tienda específica por su ID, junto con sus categorías asociadas.

**Recibe:**  
Parámetro `:id` en la URL.

**Autenticación:**  
Requiere token con rol `salesperson` o `admin`.

> ⚠️ **Nota:** No se valida si el `salesperson` es dueño de la tienda. Se valorará durante la implementación del Frontend si controlar este hecho ahi o en la lógica de Backend.

> ✅ DONE!

**Retorna:**
- `204` – Eliminación exitosa.
- `404` – Tienda no encontrada.
- `500` – Error al eliminar.

---

## POST `/api/shops/:id/categories`

**Descripción:**  
Añade una categoría a una tienda.

**Recibe:**  
Parámetro `:id` en la URL y JSON con campo `categoryType`.

**Autenticación:**  
Requiere token con rol `salesperson`.

**Retorna:**
- `201` – Categoría añadida correctamente.
- `400` – Falta el campo `categoryType`.
- `404` – Tienda no encontrada.
- `500` – Error al añadir la categoría.

---

## GET `/api/shops/:id/categories`

**Descripción:**  
Obtiene las categorías de una tienda específica.

**Recibe:**  
Parámetro `:id` en la URL.

**Retorna:**
- `200` – Array de categorías.
- `404` – Tienda no encontrada.
- `500` – Error al obtener las categorías.

---

## DELETE `/api/shops/:shopId/categories/:categoryType`

**Descripción:**  
Elimina una categoría específica de una tienda.

**Recibe:**  
Parámetros `:shopId` y `:categoryType` en la URL.

**Autenticación:**  
Requiere token con rol `salesperson`.

> ⚠️ **Nota:** No se verifica si el usuario es dueño de la tienda. Se valorará durante la implementación del Frontend si controlar este hecho ahi o en la lógica de Backend.

> ✅ DONE!

**Retorna:**
- `204` – Categoría eliminada exitosamente.
- `404` – Tienda no encontrada.
- `500` – Error al eliminar la categoría.
