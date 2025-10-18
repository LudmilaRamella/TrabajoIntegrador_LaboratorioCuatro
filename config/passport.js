const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const db = require("../config/database"); // tu conexión MySQL o Sequelize

module.exports = function(passport) {
  // Estrategia Local
  passport.use(
    new LocalStrategy({ usernameField: "username" }, async (username, password, done) => {
      try {
        // Buscar usuario por username
        const [rows] = await db.query("SELECT * FROM usuarios WHERE username = ?", [username]);
        if (rows.length === 0) {
          return done(null, false, { message: "Usuario no encontrado" });
        }

        const user = rows[0];

        // Comparar contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Contraseña incorrecta" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  // Serialización
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialización
  passport.deserializeUser(async (id, done) => {
    try {
      const [rows] = await db.query("SELECT * FROM usuarios WHERE id = ?", [id]);
      if (rows.length === 0) return done(new Error("Usuario no encontrado"));
      done(null, rows[0]);
    } catch (err) {
      done(err);
    }
  });
};
