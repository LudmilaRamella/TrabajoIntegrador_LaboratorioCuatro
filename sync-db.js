// sync-db.js
const sequelize = require("./config/database");

// Importa todos los modelos (importante para que se registren las relaciones)
require("./models/usuario");
require("./models/categoria");
require("./models/producto");
require("./models/carrito");
require("./models/itemCarrito");

(async () => {
  try {
    await sequelize.sync({ alter: true }); // crea o actualiza las tablas según el modelo
    console.log("✅ Todas las tablas creadas/verificadas correctamente");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al sincronizar modelos:", error);
    process.exit(1);
  }
})();
