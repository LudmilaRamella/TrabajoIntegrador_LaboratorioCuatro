
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Carrito = require("./carrito");
const Producto = require("./producto");

const ItemCarrito = sequelize.define("ItemCarrito", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 },
  },
  precio_actual: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: { min: 0 },
  },
}, {
  tableName: "items_carrito",
  timestamps: false,
});

// 🔗 Relaciones
ItemCarrito.belongsTo(Carrito, { foreignKey: "carrito_id" });
Carrito.hasMany(ItemCarrito, { foreignKey: "carrito_id" });

ItemCarrito.belongsTo(Producto, { foreignKey: "producto_id" });
Producto.hasMany(ItemCarrito, { foreignKey: "producto_id" });

module.exports = ItemCarrito;
