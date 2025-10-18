const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Usuario = require("./usuario");

const Carrito = sequelize.define("Carrito", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  estado: {
    type: DataTypes.ENUM("activo", "confirmado"),
    defaultValue: "activo",
  },
}, {
  tableName: "carritos",
  timestamps: false,
});

// 🔗 Relación: un Usuario tiene muchos Carritos
Carrito.belongsTo(Usuario, { foreignKey: "usuario_id" });
Usuario.hasMany(Carrito, { foreignKey: "usuario_id" });

module.exports = Carrito;
