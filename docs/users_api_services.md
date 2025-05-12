# Endpoints de la API de Users

## POST `/api/users`

**Descripción:**  
Crea un nuevo usuario en la base de datos.

**Recibe:**  
Un JSON con los campos: `name`, `username`, `password`, `email`, `role`.

**Retorna:**
- `201` – Usuario creado si todo es correcto.
- `403` – Si el rol no es válido.
- `500` – Si ocurre un error durante la creación.

---

## GET `/api/users`

**Descripción:**  
Obtiene la lista de todos los usuarios registrados.

**Recibe:**  
No recibe parámetros en el cuerpo ni en la URL.

**Retorna:**
- `200` – Un array de usuarios.
- Solo accesible para usuarios con rol `admin`.

---

## GET `/api/users/:id`

**Descripción:**  
Obtiene la información de un usuario específico por su ID.

**Recibe:**  
El parámetro `:id` en la URL.

**Retorna:**
- `200` – Con el usuario correspondiente.
- `404` – Si el usuario no existe.

---

## PUT `/api/users/:id`

**Descripción:**  
Actualiza los datos de un usuario. Solo puede hacerlo el propio usuario.

**Recibe:**  
Parámetro `:id` en la URL y un JSON con campos opcionales:  
`name`, `username`, `email`, `role`, `passwordActual`, `newPassword`.

**Retorna:**
- `200` – Si se actualiza correctamente.
- `400` – Si faltan credenciales o no coinciden.
- `403` – Si otro usuario intenta modificarlo.
- `500` – Si hay error interno.

---

## DELETE `/api/users/:id`

**Descripción:**  
Elimina un usuario específico por ID. Solo para admins.

**Recibe:**  
Parámetro `:id` en la URL.

**Retorna:**
- `204` – Si se elimina correctamente.
- `404` – Si el usuario no se encuentra.

