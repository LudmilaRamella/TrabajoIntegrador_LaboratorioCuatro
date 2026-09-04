# Carrito Online

Aplicación web renderizada en el servidor para consultar productos y administrar un carrito de compras por usuario. Incluye registro, inicio de sesión local, vistas protegidas y persistencia en una base de datos MySQL.

El proyecto fue desarrollado como trabajo integrador de Laboratorio IV. No expone una API REST: Express procesa las rutas y renderiza las páginas con Handlebars.

## Funcionalidades implementadas

- Registro de usuarios con contraseña cifrada mediante `bcryptjs`.
- Inicio y cierre de sesión con Passport y sesiones de Express.
- Protección de las páginas privadas para usuarios autenticados.
- Vista de inicio y perfil del usuario activo.
- Listado de productos y categorías almacenados en MySQL.
- Catálogo con la categoría asociada a cada producto.
- Creación automática de un carrito activo al agregar el primer producto.
- Incremento de la cantidad cuando se vuelve a agregar un producto existente.
- Consulta del carrito activo, cálculo de subtotales y total.
- Interfaz adaptable construida con Bootstrap y estilos CSS propios.

## Tecnologías

- Node.js y npm.
- Express 5.
- Handlebars y `express-handlebars` para las vistas.
- Sequelize 6 como ORM.
- MySQL mediante `mysql2`.
- Passport Local para autenticación.
- `express-session` y `connect-flash` para sesiones y mensajes.
- `bcryptjs` para el hash de contraseñas.
- Bootstrap 5.3.2 cargado desde CDN.
- Nodemon para el entorno de desarrollo.

## Modelo de datos

La aplicación define cinco tablas sin timestamps automáticos:

- `usuarios`: nombre, apellido, email único y contraseña cifrada.
- `categorias`: nombre único.
- `productos`: nombre, precio, stock, stock mínimo, imagen y categoría.
- `carritos`: usuario, fecha de creación y estado (`activo` o `confirmado`).
- `items_carrito`: carrito, producto, cantidad y precio registrado al agregarlo.

Relaciones definidas:

- Un usuario puede tener varios carritos.
- Una categoría puede tener varios productos.
- Un carrito puede tener varios ítems.
- Un producto puede aparecer en varios ítems de carrito.

## Estructura del proyecto

```text
.
├── config/
│   ├── database.js       # Conexión de Sequelize
│   └── passport.js       # Estrategia local y serialización de usuarios
├── middlewares/
│   └── authMiddleware.js # Protección de rutas privadas
├── models/               # Modelos y relaciones de Sequelize
├── public/
│   └── css/styles.css    # Estilos propios
├── routers/              # Rutas de autenticación, catálogo y carrito
├── views/
│   ├── auth/             # Login y registro
│   ├── layouts/          # Layout principal
│   ├── partials/         # Barra de navegación
│   └── *.hbs             # Páginas de la aplicación
├── .env.example          # Variables requeridas sin credenciales reales
├── index.js              # Configuración y arranque del servidor
├── package.json          # Dependencias y scripts
└── sync-db.js            # Sincronización de modelos con MySQL
```

## Requisitos

- Node.js 22.15.0 o superior. Esta versión mínima está determinada por `express-handlebars` 8.
- npm.
- Un servidor MySQL accesible y una base de datos creada.
- Conexión a Internet para descargar dependencias y cargar Bootstrap desde el CDN.

## Instalación

1. Clonar o descargar el repositorio y entrar en su directorio.

2. Instalar exactamente las dependencias registradas en el lockfile:

   ```bash
   npm ci
   ```

3. Crear el archivo local de configuración a partir del ejemplo:

   En PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

   En macOS o Linux:

   ```bash
   cp .env.example .env
   ```

4. Editar `.env` con los datos de la instancia local de MySQL. El archivo está ignorado por Git y no debe versionarse.

5. Crear la base de datos indicada en `DB_NAME`. Con los valores del ejemplo:

   ```sql
   CREATE DATABASE tp_integrador
     CHARACTER SET utf8mb4
     COLLATE utf8mb4_unicode_ci;
   ```

6. Crear o actualizar las tablas desde los modelos:

   ```bash
   npm run db:sync
   ```

   Este comando usa `sequelize.sync({ alter: true })`. Está pensado para desarrollo y puede modificar la estructura de tablas existentes; conviene respaldar cualquier base que ya contenga datos.

## Configuración

| Variable | Requerida | Valor de ejemplo | Uso |
| --- | --- | --- | --- |
| `PORT` | No | `3000` | Puerto HTTP. Si se omite, usa `3000`. |
| `SESSION_SECRET` | Sí | valor de reemplazo | Firma la cookie de sesión. Debe ser larga, aleatoria y privada. |
| `DB_NAME` | No | `tp_integrador` | Nombre de la base de datos. |
| `DB_USER` | No | `root` | Usuario de MySQL. |
| `DB_PASS` | No | vacío | Contraseña de MySQL. |
| `DB_HOST` | No | `localhost` | Host de MySQL. |
| `DB_PORT` | No | `3306` | Puerto de MySQL. |
| `DB_DIALECT` | No | `mysql` | Dialecto de Sequelize. El proyecto incluye únicamente el driver de MySQL. |

Se puede generar un secreto de sesión con Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Ejecución

Modo desarrollo, con reinicio automático:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

Luego abrir [http://localhost:3000](http://localhost:3000), o el puerto configurado en `.env`. Un visitante sin sesión será redirigido a `/login`.

## Scripts disponibles

| Comando | Descripción |
| --- | --- |
| `npm start` | Inicia el servidor con Node.js. |
| `npm run dev` | Inicia el servidor con Nodemon. |
| `npm run db:sync` | Sincroniza los cinco modelos con la base de datos. |

El repositorio no incluye una suite de pruebas automatizadas.

## Rutas principales

| Método | Ruta | Acceso | Comportamiento |
| --- | --- | --- | --- |
| `GET` | `/login` | Público | Muestra el formulario de inicio de sesión. |
| `POST` | `/login` | Público | Autentica con email y contraseña. |
| `GET` | `/registro` | Público | Muestra el formulario de registro. |
| `POST` | `/registro` | Público | Crea un usuario y cifra su contraseña. |
| `GET` | `/logout` | Público | Cierra la sesión si existe y redirige al login. |
| `GET` | `/` | Privado | Muestra el inicio. |
| `GET` | `/perfil` | Privado | Muestra los datos del usuario activo. |
| `GET` | `/productos` | Privado | Lista productos y permite agregarlos al carrito. |
| `GET` | `/catalogo` | Privado | Renderiza el catálogo con categorías. |
| `GET` | `/categorias` | Privado | Lista las categorías. |
| `GET` | `/carrito` | Privado | Muestra el carrito activo y su total. |
| `GET` | `/carrito/agregar/:id` | Privado | Agrega una unidad del producto indicado. |

## Alcance actual

El código disponible todavía no implementa el alta de categorías que aparece en la vista, el formulario `POST` para agregar desde `/catalogo`, ni las acciones para eliminar ítems o confirmar una compra que se muestran en el carrito. Tampoco incluye carga inicial de categorías/productos ni edición del perfil. Para recorrer el catálogo es necesario insertar previamente categorías y productos en MySQL.

Las sesiones usan el almacenamiento en memoria predeterminado de `express-session`, adecuado para desarrollo local pero no para un despliegue productivo con varias instancias.
