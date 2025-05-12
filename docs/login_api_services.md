# Endpoint de Autenticación

## POST `/api/login`

**Descripción:**  
Permite a un usuario autenticarse en la aplicación proporcionando su `username` y `password`. Devuelve un token JWT y datos del usuario si las credenciales son válidas.

**Recibe:**  
JSON con los siguientes campos:
- `username`: Nombre de usuario (string).
- `password`: Contraseña del usuario (string).

**Autenticación:**  
No requiere autenticación previa.

**Retorna:**
- `200 OK` – Login exitoso. Devuelve un objeto con:
  - `token`: Token JWT válido por 1 hora.
  - `id`: ID del usuario.
  - `username`: Nombre de usuario.
  - `name`: Nombre real del usuario.
  - `role`: Rol asignado al usuario (`admin`, `salesperson`, `shopper`, etc.).

- `401 Unauthorized` – Credenciales inválidas (`username` o `password` incorrectos).
- `500 Internal Server Error` – Error en el servidor al procesar la solicitud.

---
