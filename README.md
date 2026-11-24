# La Bella y la Bestia

**Tienda de moda responsive desarrollada con JavaScript, HTML y CSS.**

Proyecto front-end orientado a ofrecer una experiencia completa de ecommerce: catálogo visual, búsqueda, favoritos, carrito, perfiles de usuario, simulación de pagos y generación de facturas.

## Vista del proyecto

- **Demo frontend:** https://vanilla-clothing-store-frontend.vercel.app
- **API desplegada:** https://vanilla-clothing-store-backend.vercel.app
- **Estado:** proyecto funcional de portafolio

## Características principales

- Catálogo dividido en productos de mujer y hombre.
- Navegación por categorías y slider de productos destacados.
- Buscador con filtrado dinámico.
- Favoritos persistentes y carrito de compras.
- Selector de tallas y cantidades.
- Registro e inicio de sesión simulado.
- Perfil editable y cambio de contraseña.
- Métodos de pago simulados.
- Historial y seguimiento visual de pedidos.
- Dashboard de estadísticas de pedidos.
- Generación y descarga de facturas en PDF.
- Persistencia mediante `localStorage`.
- Carga de productos e imágenes desde Firebase y Cloudinary.
- Diseño responsive para móvil, tablet y escritorio.

## Tecnologías

### Frontend

- HTML5
- CSS3
- JavaScript ES Modules
- Swiper
- html2pdf.js

### Backend

- Node.js
- Express
- Firebase Admin SDK
- Cloudinary SDK
- CORS
- dotenv

## Arquitectura

El proyecto utiliza una arquitectura sencilla de dos capas:

```text
Navegador
  |
  |-- HTML, CSS y módulos JavaScript
  |-- Estado de interfaz y datos locales
  |-- Caché y preferencias en localStorage
  |
  +--> API Express
         |
         |-- Firebase Firestore
         |-- Cloudinary
         +-- Reglas de migración de imágenes
```

### Organización del frontend

```text
front-end/
├── index.html
├── style.css
└── js/
    ├── assets.js
    ├── events.js
    ├── main.js
    ├── products.js
    ├── render.js
    ├── selectors.js
    ├── state.js
    ├── storage.js
    └── utils.js
```

- `assets.js`: recursos visuales y textos alternativos.
- `events.js`: interacción y flujos de usuario.
- `main.js`: inicialización de la aplicación.
- `products.js`: carga y clasificación del catálogo.
- `render.js`: representación dinámica del DOM.
- `selectors.js`: referencias centralizadas a elementos HTML.
- `state.js`: estado de usuarios, pedidos, favoritos y carrito.
- `storage.js`: lectura y escritura de datos locales.
- `utils.js`: funciones reutilizables de interfaz.

### Organización del backend

```text
back-end/
├── server.js
├── package.json
└── package-lock.json
```

El servidor expone consultas de productos, utilidades para Cloudinary y procesos de migración de referencias de imágenes.

## API disponible

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/` | Comprueba el estado del servidor. |
| `GET` | `/api/products-with-images` | Devuelve productos de Firestore con URLs de Cloudinary. |
| `GET` | `/api/check-firebase` | Consulta una muestra de productos de Firestore. |
| `GET` | `/api/images` | Lista imágenes disponibles en Cloudinary. |
| `GET` | `/api/image-urls` | Devuelve URLs de imágenes en formato JSON. |
| `GET` | `/api/image-urls-text` | Devuelve URLs de imágenes como texto plano. |
| `GET` | `/api/multiple-candidates` | Detecta productos con candidatos de imagen duplicados. |
| `POST` | `/api/migrate-image-urls` | Ejecuta la migración de imágenes a Firestore; usa simulación por defecto. |

## Requisitos

- Node.js 18 o superior.
- npm.
- Un navegador moderno.
- Proyecto configurado en Firebase.
- Cuenta configurada en Cloudinary.

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd Vanilla-Clothing-Store
```

### 2. Ejecutar el backend

```bash
cd back-end
npm install
npm start
```

Por defecto, el servidor utiliza el puerto `3000`, salvo que se configure otro mediante el entorno.

### 3. Ejecutar el frontend

Desde la carpeta `front-end`, sirve los archivos con un servidor HTTP local:

```bash
npx serve . -l 5500
```

Después abre:

```text
http://localhost:5500
```

## Configuración del backend

El backend espera variables de entorno para Cloudinary, Firebase y CORS. Los nombres utilizados por el código son:

- `PORT`
- `FRONTEND_URL`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `FIREBASE_SERVICE_ACCOUNT`

Crea un archivo local `back-end/.env` para el entorno de desarrollo. No compartas ni agregues al control de versiones credenciales, claves privadas, certificados o cuentas de servicio.

El valor de `FIREBASE_SERVICE_ACCOUNT` debe representar el JSON completo de la cuenta de servicio utilizada por el servidor.

## Persistencia local

El navegador almacena:

- Productos y favoritos.
- Contenido del carrito.
- Historial y estados de pedidos.
- Usuario activo.
- Caché temporal de productos.
- Métodos de pago simulados.

Para reiniciar el estado durante pruebas, elimina los datos del sitio desde las herramientas de desarrollo del navegador.

## Scripts disponibles

En `back-end/package.json`:

```bash
npm start
npm test
```

Actualmente `npm start` inicia el servidor Express y el proyecto todavía no incluye una suite automatizada configurada en `npm test`.

El frontend no contiene scripts de npm propios.

## Flujo de usuario

1. El usuario explora el catálogo por género y categoría.
2. Selecciona talla y cantidad.
3. Agrega productos al carrito o a favoritos.
4. Inicia o registra una sesión simulada.
5. Completa una compra mediante el flujo de pago local.
6. Consulta el pedido, cambia su estado en el dashboard de pruebas y genera una factura.

## Consideraciones de seguridad

Este proyecto demuestra flujos de interfaz y persistencia local. Los usuarios, contraseñas, tarjetas y pagos incluidos son simulados y no representan un sistema autenticado ni una pasarela de pago real.

Antes de utilizarlo en producción:

- Implementar autenticación segura.
- Migrar la información sensible a un backend protegido.
- Integrar una pasarela de pago certificada.
- Validar datos en el servidor.
- Configurar una política CORS específica.
- Gestionar secretos mediante un proveedor seguro.

## Posibles mejoras

- Migrar el estado global a una arquitectura con gestión estructurada.
- Incorporar una base de datos de usuarios y pedidos.
- Implementar autenticación con Firebase Authentication.
- Integrar una pasarela de pagos real.
- Añadir pruebas unitarias y end-to-end.
- Crear un pipeline de lint, build y despliegue.
- Incorporar paginación y filtros avanzados.
- Optimizar imágenes y carga diferida.

## Licencia

El backend declara la licencia `ISC` en `back-end/package.json`. Si el repositorio se publica públicamente, conviene documentar una licencia única para todo el proyecto.
