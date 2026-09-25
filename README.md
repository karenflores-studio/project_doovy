# Doovy
Catálogo de álbumes musicales y artistas, con sitio web y API REST.

**Parcial 1 — Aplicaciones Híbridas**
```
Tecnicatura Superior en Diseño y Programación Web
Escuela Da Vinci 
2026
Alumna: Karen Apaza Flores
```
---
Configurar las variables de entorno

Crear un archivo `.env` en la raíz del proyecto, tomando como base la plantilla `.env.example`:

```
MONGO_URI=<se entregó aparte>
DB_NAME=AH20232CP1
PORT=3333
```


## Decisiones de implementación

**Conexión única a MongoDB.** Vive en `config/db.js` y la importan los dos servicios. Se abre explícitamente al arrancar, antes de levantar el servidor: si las credenciales están mal, el error aparece al instante y no en el primer pedido de un usuario.

**Escapado de HTML.** Todos los datos que se insertan en las vistas pasan por `esc()` (`views/helpers.js`), que convierte los caracteres especiales para prevenir XSS.

**Un solo formulario para alta y edición.** `formularioAlbum()` detecta el modo según reciba o no un `_id`, y ajusta el `action` y los valores. Evita mantener dos funciones casi idénticas.

**Patrón POST / Redirect / GET.** Después de una operación de escritura se redirige en lugar de devolver HTML directamente, para que recargar la página no reenvíe el formulario.

**PUT y PATCH separados.** `PUT` usa `replaceOne` y `PATCH` usa `updateOne` con `$set`. La parte web usa `PATCH` para no perder los campos que no están en el formulario.

**Manejo de errores.** El detalle se registra en la consola del servidor y al cliente se le devuelve un mensaje genérico, para no exponer rutas internas ni datos de conexión.

**Validación del formato de ObjectId** antes de consultar, porque el driver lanza una excepción con ids mal formados.
