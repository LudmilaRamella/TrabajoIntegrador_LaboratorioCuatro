const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Categoria = require("./categoria");

const Producto = sequelize.define("Producto", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  precio: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: { min: 0 },
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0 },
  },
  stock_minimo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0 },
  },
  imagen: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
}, {
  tableName: "productos",
  timestamps: false,
});

// 🔗 Relación: Producto pertenece a una Categoría
Producto.belongsTo(Categoria, { foreignKey: "categoria_id" });
Categoria.hasMany(Producto, { foreignKey: "categoria_id" });

module.exports = Producto;
