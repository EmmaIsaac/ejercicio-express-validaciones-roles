# Documentación de la API de Gestión de Turnos

Esta API permite gestionar turnos, incluyendo la creación, consulta, actualización y eliminación de los mismos. Para acceder a sus funcionalidades, los usuarios deben registrarse y autenticarse. La API utiliza **MongoDB** para la gestión de datos y **Express-Validator** para validar las entradas de datos.

## **Endpoints Disponibles**

### **1. Autenticación**

#### **Registro de Usuario**

**URL:** `/api/users/register`  
**Método:** `POST`  
**Descripción:** Permite registrar un nuevo usuario en el sistema.  
**Cuerpo de la Solicitud (JSON):**

```json
{
  "username": "string",
  "password": "string"
}
```

**Respuestas:**

- **201:** Usuario creado exitosamente.
- **400:** Campos obligatorios no proporcionados.
- **500:** Error interno del servidor.

#### **Inicio de Sesión**

**URL:** `/api/users/login`  
**Método:** `POST`  
**Descripción:** Autentica a un usuario y genera un token.  
**Cuerpo de la Solicitud (JSON):**

```json
{
  "username": "string",
  "password": "string"
}
```

**Respuestas:**

- **200:** Devuelve el token de autenticación.
- **400:** Campos obligatorios no proporcionados.
- **500:** Error interno del servidor.

---

### **2. Gestión de Turnos**

#### **Obtener Todos los Turnos**

**URL:** `/api/turnos`  
**Método:** `GET`  
**Descripción:** Devuelve la lista completa de turnos.  
**Respuestas:**

- **200:** Lista de turnos.
- **404:** No se encontraron turnos.
- **500:** Error interno del servidor.

#### **Obtener un Turno por ID**

**URL:** `/api/turnos/:id`  
**Método:** `GET`  
**Descripción:** Devuelve los detalles de un turno específico.  
**Parámetros de URL:**

- `id` (string): ID del turno.  
  **Respuestas:**
- **200:** Detalles del turno.
- **404:** Turno no encontrado.
- **500:** Error interno del servidor.

#### **Crear un Nuevo Turno**

**URL:** `/api/turnos`  
**Método:** `POST`  
**Descripción:** Crea un nuevo turno.  
**Cuerpo de la Solicitud (JSON):**

```json
{
  "cliente": {
    "nombre": "string",
    "numeroContacto": "string"
  },
  "fecha": "string (YYYY-MM-DD)",
  "hora": "string (HH:MM)",
  "profesional": "string",
  "servicio": "string"
}
```

**Respuestas:**

- **201:** Turno creado exitosamente.
- **400:** Validación fallida.
- **409:** Turno ya existente.
- **500:** Error interno del servidor.

#### **Actualizar un Turno**

**URL:** `/api/turnos/:id`  
**Método:** `PUT`  
**Descripción:** Actualiza un turno existente.  
**Parámetros de URL:**

- `id` (string): ID del turno.

**Cuerpo de la Solicitud (JSON):**

```json
{
  "fecha": "string (YYYY-MM-DD)",
  "hora": "string (HH:MM)",
  "profesional": "string",
  "servicio": "string",
  "estado": "string"
}
```

**Respuestas:**

- **200:** Turno actualizado exitosamente.
- **400:** Validación fallida.
- **404:** Turno no encontrado.
- **409:** El turno está ocupado y no se puede actualizar.
- **500:** Error interno del servidor.

#### **Eliminar un Turno**

**URL:** `/api/turnos/:id`  
**Método:** `DELETE`  
**Descripción:** Elimina un turno por su ID.  
**Parámetros de URL:**

- `id` (string): ID del turno.  
  **Respuestas:**
- **200:** Turno eliminado exitosamente.
- **404:** Turno no encontrado.
- **500:** Error interno del servidor.

---

## **Requisitos Previos**

1. **Registro y Autenticación:**  
   Para utilizar la API, primero debes registrarte mediante el endpoint `/register` y luego autenticarte en `/login`. El token recibido en el inicio de sesión debe incluirse en la cabecera `Authorization` como `Bearer <token>` para los endpoints protegidos.

2. **Validaciones:**  
   Los datos enviados en las solicitudes son validados utilizando **Express-Validator**. Si la validación falla, se devolverá un error con los detalles de las fallas.

---

## **Base de Datos**

La API utiliza **MongoDB** como base de datos principal. Las colecciones principales son:

- **Usuarios:** Almacena la información de los usuarios registrados.
- **Turnos:** Registra los turnos, incluyendo su fecha, hora, profesional, servicio y estado.

---

## **Códigos de Estado**

| Código | Descripción                        |
| ------ | ---------------------------------- |
| 200    | Solicitud exitosa.                 |
| 201    | Recurso creado exitosamente.       |
| 400    | Error en la solicitud del cliente. |
| 404    | Recurso no encontrado.             |
| 409    | Conflicto en los datos.            |
| 500    | Error interno del servidor.        |

---

## **Tecnologías Utilizadas**

- **Node.js** con **Express.js** para el backend.
- **Helmet** para la seguridad.
- **MongoDB** para almacenamiento de datos.
- **Mongoose** para interactuar con la base de datos MongoSB.
- **Express-Validator** para validación de entradas.
- **JWT** para autenticación basada en tokens.
- **Bcryptjs** para hashear el password del usuario.

## **Cómo Correr la API**

1. Instalar las dependencias:

   ```bash
   npm install
   ```

2. Configurar las variables de entorno:
   - Configura tu conexión a MongoDB.
   - Añade una clave secreta para JWT.
3. Iniciar el servidor:

   ```bash
   npm run dev
   ```

4. Accede a la API a través de `http://localhost:<puerto>` (por defecto, 3000).

¡Listo! Puedes comenzar a usar la API.
