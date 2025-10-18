require("dotenv").config(); // ✅ Carga variables del .env
const { Sequelize } = require("sequelize");

// Valores por defecto seguros si faltan en .env
const DB_NAME = process.env.DB_NAME || "tp_integrador";
const DB_USER = process.env.DB_USER || "root";
const DB_PASS = process.env.DB_PASS || "";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || 3306;
const DB_DIALECT = process.env.DB_DIALECT || "mysql";

// Inicializa conexión
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DIALECT,
  logging: false, // Desactiva logs SQL
});

// ✅ Probar conexión inmediatamente
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado correctamente a la base de datos MySQL");
  } catch (error) {
    console.error("❌ Error de conexión a la base de datos:", error.message);
  }
})();

module.exports = sequelize;
